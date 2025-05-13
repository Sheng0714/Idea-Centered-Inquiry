import React, { useEffect, useState, useRef } from "react"; 
import axios from "axios";
import config from "../../config.json";
import io from "socket.io-client";
import PostsNavbar from "../../components/ForumMode/NavbarPost";
import { ViewNode } from "../../components/ViewNode";
import url from "../../url.json";
import { genEdge, genNode } from "../../utils/ideaTool";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { getPinnedNodes, setPinnedNode, removePinnedNode } from "../../utils/pinnedNodes"; // 新增
import { md5 } from 'js-md5';
import CallComponent from '../../components/CallComponent';
import DOMPurify from 'dompurify';



export default function ForumModes_posts({ showNavbar = true }) {
    const activityInfo = JSON.parse(localStorage.getItem('activityInfo'));

    const [graph, setGraph] = useState({
        nodes: [],
        edges: [],
    });
    const [open, setOpen] = useState(false);
    const [nodeContent, setNodeContent] = useState(null);
    const [ws, setSocket] = useState(null);
    const activityId = sessionStorage.getItem("activityId");
    const networkRef = useRef(null);
    const location = useLocation();
    const [timeFilter, setTimeFilter] = useState(0); // 預設為 0，表示不篩選
    const [groupFilter, setGroupFilter] = useState('all');
    const [allNodes, setAllNodes] = useState([]);

    // 新增 groupId 作為狀態變量
    const [groupId, setGroupId] = useState(sessionStorage.getItem('groupId'));
    const [pinnedNodes, setPinnedNodes] = useState(getPinnedNodes());

    // 獲取當前小組的釘選節點 ID
    const getCurrentPinnedNodeId = () => {
        return pinnedNodes[groupId] || null;
    };

    const [pinnedNodeId, setPinnedNodeId] = useState(getCurrentPinnedNodeId());

    // 當 groupId 或 pinnedNodes 改變時，更新 pinnedNodeId
    useEffect(() => {
        setPinnedNodeId(getCurrentPinnedNodeId());
        // 更新圖表中的節點顏色
        setGraph(prevGraph => ({
            ...prevGraph,
            nodes: prevGraph.nodes.map(node => ({
                ...node,
            })),
        }));
    }, [groupId, pinnedNodes]);

    // 監聽釘選節點的更新
    useEffect(() => {
        const handlePinnedNodeUpdate = () => {
            const updatedPinnedNodes = getPinnedNodes();
            setPinnedNodes(updatedPinnedNodes);
        };

        window.addEventListener('pinnedNodeUpdated', handlePinnedNodeUpdate);

        return () => {
            window.removeEventListener('pinnedNodeUpdated', handlePinnedNodeUpdate);
        };
    }, []);

    // 移除在初次加載或篩選時自動聚焦到釘選節點的邏輯
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const focusNode = params.get('focusNode');
        if (focusNode && networkRef.current) {
            networkRef.current.focus(focusNode, { scale: 1.5, offset: { x: 0, y: 0 } });
        }
    }, [location]);

    // 新增的 handleViewPinned 函數
    const handleViewPinned = () => {
        if (pinnedNodeId) {
            const nodeId = String(pinnedNodeId);
            const pinnedNode = graph.nodes.find(node => String(node.id) === nodeId);
            console.log('釘選的節點:', pinnedNode);
            if (pinnedNode) {
                if (networkRef.current) {
                    networkRef.current.focus(nodeId, { scale: 1.5, offset: { x: 0, y: 0 } });
                }
            } else {
                alert('釘選的節點未找到');
            }
        } else {
            alert('沒有釘選的節點');
        }
    };

    const handleClickOpen = (nodeId) => {
        setNodeContent(null);
        setOpen(true);
        fetchNodeData(nodeId);

        if (networkRef.current) {
            networkRef.current.focus(nodeId, { scale: 1.5, offset: { x: 0, y: 0 } });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchNodeData = async (nodeId) => {
        try {
            const response = await axios.get(`${url.backendHost + config[11].getOneNode}/${nodeId}`);
            console.log('讀取節點內容: ', response.data);
            setNodeContent(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    // traceRoot
    const traceRoot = (data) => {
        // Create a map of 'to' to 'from' for easier lookup
        const toFromMap = data.reduce((acc, { from, to }) => {
            acc[from] = to;
            return acc;
        }, {});



        // Function to trace each node to its final goal
        const traceFinalGoal = (startNode) => {
            let currentNode = startNode;
            while (toFromMap[currentNode]) {
            currentNode = toFromMap[currentNode]; // Move to the next 'to' node
            }
            return currentNode; // Return the final goal
        };

        // Trace the final goal for each node in the dataset
        const nodes = Array.from(new Set(data.map(item => item.from))); // Get unique 'from' nodes
        const finalGoals = nodes.map(node => ({
            from: node,
            to: traceFinalGoal(node)
        }));

        return finalGoals;
    };

    // 獲取 groupId，並在其後渲染 getNodes()
    const fetchGroupData = async () => {
        const enterDifferentGroupEndpoint = `${url.backendHost}${config[16].EnterDifferentGroup}${sessionStorage.getItem(
            "joinCode"
        )}/${sessionStorage.getItem("userId")}`;
        const getMyGroupEndpoint = `${url.backendHost}${config[12].getMyGroup}/${sessionStorage.getItem(
            "activityId"
        )}/${sessionStorage.getItem("userId")}`;

        try {
            const response = await axios.get(enterDifferentGroupEndpoint);
            const fetchedGroupId = response.data.data[0].id;
            localStorage.setItem("groupId", fetchedGroupId);
            sessionStorage.setItem("groupId", fetchedGroupId);
            setGroupId(fetchedGroupId); // 更新 groupId 狀態
        } catch (error) {
            try {
                const response = await axios.get(getMyGroupEndpoint);
                const fetchedGroupId = response.data.data[0].id;
                localStorage.setItem("groupId", fetchedGroupId);
                sessionStorage.setItem("groupId", fetchedGroupId);
                setGroupId(fetchedGroupId); // 更新 groupId 狀態
            } catch (error) {
                console.error("獲取群組資料時出錯", error);
            }
        } finally {
            await getNodes();
        }
    };

    useEffect(() => {
        async function fetchData() {
            await fetchGroupData();
            setSocket(io.connect(url.socketioHost,{path: '/s/socket.io'}));
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (ws) {
            console.log("初始化 WebSocket");
            ws.on("connect", () => {
                console.log("WebSocket 已連接");
            });

            ws.on(`node-recieve-${activityId}`, (body) => {
                if (body.groupId == sessionStorage.getItem('groupId')) {
                    const newNode = {
                        createdAt: body.createdAt || new Date().toISOString(),
                        ...genNode(body),
                    };

                    const updatedAllNodes = [...allNodes, newNode];
                    setAllNodes(updatedAllNodes);

                    const filteredNodes = filterNodes(updatedAllNodes, timeFilter, groupFilter);
                    setGraph((graph) => ({
                        nodes: filteredNodes,
                        edges: graph.edges,
                    }));
                }
            });
            ws.on(`edge-recieve-${activityId}`, (body) => {
                if (body.groupId == sessionStorage.getItem("groupId")) {
                    setGraph((graph) => ({
                        nodes: graph.nodes,
                        edges: [...graph.edges, genEdge(body)],
                    }));
                }
            });
        }
    }, [ws, timeFilter, groupFilter, allNodes, activityId, groupId]);

    const getNodes = async () => {
        if (sessionStorage.getItem("groupId") == null) {
            await fetchGroupData();
        }

        try {
            const fetchData = await axios.get(`${url.backendHost + config[8].getNode}/${sessionStorage.getItem('groupId')}`);

            const fetchEdge = await axios.get(`${url.backendHost + config[10].getEdge}/${sessionStorage.getItem('groupId')}`);

            console.log("fetchData: ", fetchData);
            // console.log("fetchEdge: ", fetchEdge);

            const nodeData = fetchData.data[0].Nodes.map((node) => {
                const createdAt = node.createdAt ? new Date(node.createdAt) : null;
                const formattedCreatedAt = createdAt ? createdAt.toISOString() : 'Invalid Date';

                const generatedNode = {
                    ...genNode(node),
                    createdAt: formattedCreatedAt,
                };

                console.log(`生成節點:`, generatedNode);
                return generatedNode;
            });

            const edgeData = fetchEdge.data.map((edge) => genEdge(edge));

            console.log("nodeData: ", nodeData);
            console.log("edgeData: ", edgeData);

            setAllNodes(nodeData);

            setGraph({
                nodes: filterNodes(nodeData, timeFilter, groupFilter),
                edges: edgeData,
            });
        } catch (error) {
            console.error('獲取節點或邊時出錯:', error);
        }
    };

    const filterNodes = (nodes, timeFilter, groupFilter) => {
        const now = new Date();

        return nodes
            .filter((node) => {
                // 時間篩選
                let passesTimeFilter = true;
                if (node.createdAt && !isNaN(Date.parse(node.createdAt))) {
                    const nodeDate = new Date(node.createdAt);
                    if (timeFilter > 0) {
                        passesTimeFilter = now - nodeDate <= timeFilter * 60 * 1000;
                    } else {
                        passesTimeFilter = true; // 不篩選
                    }
                } else {
                    passesTimeFilter = false;
                }
                return passesTimeFilter;
            })
            .map((node) => {
                // 標籤篩選
                const matchesGroupFilter = groupFilter === 'all' || node.group === groupFilter;

                // 決定是否淡化節點
                const isFaded = groupFilter !== 'all' && !matchesGroupFilter;
                const isPinned = String(node.id) === String(pinnedNodeId);

                // 確保 node.color 存在
                const nodeColor = node.color || { border: '#CCCCCC', background: '#EEEEEE' };

                return {
                    ...node,
                    // 根據是否匹配群組篩選，設置顏色
                    color: isFaded
                        ? { ...nodeColor, border: '#CCCCCC', background: '#F0F0F0' } // 灰色邊框和淡灰背景
                        : nodeColor, // 保持原有顏色
                    //borderWidth: isPinned ? 3 : node.borderWidth || 1, // 保持釘選節點的邊框寬度
                };
            });
    };


    const options = {
        layout: {
            randomSeed: 23,
            improvedLayout: true,
            hierarchical: {
                enabled: true,
                blockShifting: true,
                edgeMinimization: true,
                nodeSpacing: 150,
                direction: "RL",
                sortMethod: "hubsize",
            },
        },
        interaction: {
            navigationButtons: showNavbar ? true : false,
            dragNodes: true,
            dragView: true,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            hideNodesOnDrag: false,
            hover: false,
            hoverConnectedEdges: true,
            keyboard: {
                enabled: false,
                speed: { x: 10, y: 10, zoom: 0.02 },
                bindToWindow: true,
            },
            multiselect: false,
            selectable: true,
            selectConnectedEdges: true,
            tooltipDelay: 300,
            zoomSpeed: 1,
            zoomView: true,
        },
        clickToUse: false,
        groups: {
            idea: {
                color: {
                    border: "#FFC",
                    background: "#FFC",
                    fontSize: 5,
                    highlight: {
                        border: "#FFC",
                        background: "#FFC",
                    },
                },
            },
            question: {
                color: {
                    border: "#CCF",
                    background: "#CCF",
                    highlight: {
                        border: "#CCF",
                        background: "#CCF",
                    },
                },
            },
            information: {
                color: {
                    border: "#CFC",
                    background: "#CFC",
                    highlight: {
                        border: "#CFC",
                        background: "#CFC",
                    },
                },
            },
            experiment: {
                color: {
                    border: "#FFDBDB",
                    background: "#FFDBDB",
                    highlight: {
                        border: "#FFDBDB",
                        background: "#FFDBDB",
                    },
                },
            },
            record: {
                color: {
                    border: "#B9DCF4",
                    background: "#B9DCF4",
                    highlight: {
                        border: "#B9DCF4",
                        background: "#B9DCF4",
                    },
                },
            },
            reply: {
                color: {
                    border: "#FFF",
                    background: "#FFF",
                    highlight: {
                        border: "#FFF",
                        background: "#FFF",
                    },
                },
            },
            // 可以在此添加更多群組
        },
        edges: {
            color: "#8B8B8B",
            width: 1,
            length: 600,
            arrows: {
                from: {
                    enabled: true,
                    scaleFactor: 0.7,
                },
                to: {
                    enabled: false,
                },
            },
        },
        nodes: {
            shape: "box",
            borderWidth: 1,
            shapeProperties: {
                borderRadius: 1,
            },
            opacity: 1, // 默認透明度
            fixed: {
                x: true,
                y: true,
            },
            font: {
                color: "#343434",
                size: 2, // px
                face: "arial",
                background: "none",
                strokeWidth: 0, // px
                strokeColor: "#ffffff",
                align: "left",
                multi: false,
                vadjust: 0,
                bold: {
                    color: "#343434",
                    size: 2, // px
                    face: "arial",
                    vadjust: 0,
                    mod: "bold",
                },
                ital: {
                    color: "#343434",
                    size: 5, // px
                    face: "arial",
                    vadjust: 0,
                    mod: "italic",
                },
                boldital: {
                    color: "#343434",
                    size: 5, // px
                    face: "arial",
                    vadjust: 0,
                    mod: "bold italic",
                },
                mono: {
                    color: "#343434",
                    size: 5, // px
                    face: "courier new",
                    vadjust: 2,
                    mod: "",
                },
            },
            hidden: false,
            label: "HTML",
            level: undefined,
            margin: 10,
            shadow: {
                color: "rgba(33,33,33,.7)",
                size: 10,
                x: 10,
                y: 10,
            },
            heightConstraint: { minimum: 100, valign: "middle" },
            widthConstraint: { minimum: 100, maximum: 100 },
            mass: 1,
            physics: false,
            scaling: {
                label: {
                    enabled: true,
                    min: 16,
                    max: 16,
                    drawThreshold: 12,
                    // maxVisible: 30,
                },
                customScalingFunction: function (min, max, total, value) {
                    if (max === min) {
                        return 0.5;
                    } else {
                        let scale = 1 / (max - min);
                        return Math.max(0, (value - min) * scale);
                    }
                },
            },
            value: 1,
        },
    };

    const events = {
        click: (event) => {
            console.log(`Graph:click:events:`, event);
            console.log(`Graph:click:graph`, graph);
            if (event.nodes.length === 1) {
                handleClickOpen(event.nodes[0]);
                sessionStorage.setItem('nodeId', event.nodes[0]);
            }
        },
        add_reply: (nodeid) => {
            console.log(`Graph:click:nodeid:`, nodeid);
            handleClickOpen(nodeid);
            sessionStorage.setItem('nodeId', nodeid);
        },
    };

    // 論壇式介面
    const Post = ({ data }) => {

        console.log('Post:data:', data);
        // findPrevNode
        let prevNodeTree = data.edges.reduce((acc, edge) => {
            // 假設每個 edge 物件有一個唯一的 id 屬性
            acc[edge.from] = edge.to;
            return acc;
          }, {});

        // findRootNode
        let nodeTree = traceRoot(data.edges);


        // 建立節點字典以便查詢
        const nodesMap = data.nodes.reduce((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});
        


        // 找到所有主要節點（沒有前置節點）
        const mainNodes = data.nodes.filter(
            (node) => !nodeTree.some((edge) => edge.from == node.id)
        );
        console.log('Post:mainNodes:', mainNodes);
        
        // 遞迴查找子節點
        const findReplies = (rootId) => {
            return nodeTree
            .filter(
                (edge) => edge.to == rootId
            ).map((edge) => nodesMap[edge.from]);
        };
        
        // 構建層級結構
        const threads = mainNodes.map((mainNode) => ({
            ...mainNode,
            replies: findReplies(mainNode.id),
        }));
        console.log('Post:threads:', threads);
        
        // 遞迴渲染回覆
        const renderReplies = (replies, level = 1) => {
            return replies? replies.map((reply) => (
            <div
                id={md5(reply.id.toString())}
                key={reply.id}
                style={{
                marginLeft: `0px`,
                marginBottom: '0px',
                padding: '10px 0 0px 0',
                borderRadius: '5px',
                backgroundColor: '#fff',
                border: `1px solid ${reply.color.border}`
                }}
            >
                <div><strong>{reply.label.split('\n')[2]}</strong></div>

                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reply.title) }} style={{ 
                    paddingBottom: '20px',
                    }}/>
                <div style={{ 
                    fontSize: 'small', 
                    color: 'gray' 
                    }}>
                    {reply.label.split('\n')[4]}於{new Date(reply.createdAt).toLocaleString()}發布 - #{md5(reply.id.toString()).substring(0, 5)}
                    <button
                        style={{
                            float: 'right',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            cursor: 'pointer',
                            }}
                        onClick={() => events.add_reply(reply.id)}
                        >
                            回覆留言 
                    </button>
                    <br/>
                    <a href={`#${md5(prevNodeTree[reply.id].toString())}`}>
                        回覆給: #{md5(prevNodeTree[reply.id].toString()).substring(0, 5)}
                    </a>

                    <hr style={{ marginLeft: '48%',marginRight: '48%',borderColor: 'lightgray'}}/>
                </div>
                
                {renderReplies(reply.replies, level+1)} {/* 遞迴渲染下一層回覆 */}
                
            </div>
            )) : <div/>; 
        };


        
        return (
            <div style={{ margin: '20px auto', maxWidth: '800px' }}>
            {
                activityInfo && activityInfo.settings.intro &&(
                    <div
                style={{
                    margin: '0 auto',
                    marginBottom: '100px',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
                >
                    <p style={{ marginBottom: '5px',padding: '20px 20px' }}>活動資訊和說明</p>
                    <h2 style={{ marginBottom: '5px',padding: '20px 20px' }}>{activityInfo.settings.intro}</h2>

                </div>
                )
            }
            {threads.map((thread) => (
                <div
                key={thread.id}
                style={{
                    marginBottom: '100px',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${thread.color.border}`,
                }}
                >
                    {/* 主節點內容 */}
                    <div 
                        id={md5(thread.id.toString())}
                    >
                        <h2 style={{ marginBottom: '5px' }}>{thread.label.split('\n')[2]}</h2>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(thread.title) }} style={{ paddingBottom: '20px' }}/>
                        <small style={{ color: 'gray' }}>
                            {thread.label.split('\n')[4]} 發佈於 {new Date(thread.createdAt).toLocaleString()}
                        </small><br/>
                        <small style={{ color: 'gray' }}>
                            #{md5(thread.id.toString()).substring(0, 5)}
                        </small>
                        <button
                        style={{
                                float: 'right',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                            onClick={() => events.add_reply(thread.id)}
                        >
                            回覆貼文
                        </button>
                    </div>
                    
                    <hr style={{ marginLeft: '30px',marginRight: '30px',borderColor: 'darkgray'}}/>

                    {/* 留言串 */}
                    {renderReplies(thread.replies)}
                    
                </div>
            ))}
            </div>
        );
    };
          
      
  

    // 添加調試信息
    useEffect(() => {
        console.log('Current groupId:', groupId);
        console.log('PinnedNodes:', pinnedNodes);
        console.log('Current pinnedNodeId:', pinnedNodeId);
    }, [groupId, pinnedNodes, pinnedNodeId]);

    return (
        <div className="home-container">
            {showNavbar && <PostsNavbar ws={ws} />}
            {
                <div
                id="graph"
                style={{
                    flex: "1 1 0%",
                    height: "100vh",
                    overflow: "auto",
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                    "margin-left": "64px",
                    "margin-top": "64px",
                    right: "0px"
                }}><Post data={graph} />
                </div>
            }   
            <ViewNode open={open} onClose={handleClose} nodeContent={nodeContent} ws={ws} groupId={groupId}/>
            {
                activityInfo && activityInfo.settings.helper_system &&(
                    <div style={{ height: '100vh' }}>
                        <CallComponent />
                    </div>
                )
            }
            
        </div>
    );
}
