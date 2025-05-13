import React, { useEffect, useState, useRef } from "react"; 
import axios from "axios";
import config from "../../config.json";
import io from "socket.io-client";
import ChatroomNavbar from "../../components/ForumMode/NavbarChatroom";
import { ViewNode } from "../../components/ViewNode";
import url from "../../url.json";
import { genEdge, genNode } from "../../utils/ideaTool";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { getPinnedNodes, setPinnedNode, removePinnedNode } from "../../utils/pinnedNodes"; // 新增
import CallComponent from '../../components/CallComponent';
import DOMPurify from 'dompurify';



export default function ForumModes_chatroom({ showNavbar = true }) {
    const activityInfo = JSON.parse(localStorage.getItem('activityInfo'));
    const [graph, setGraph] = useState({
        nodes: [],
        edges: [],
    });
    const [graphKey, setGraphKey] = useState(0); // 用於強制刷新圖表
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
            setNodeContent(response.data);
            // console.log('節點內容: ', response.data);
        } catch (err) {
            console.error(err);
        }
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

    const handleTimeFilterChange = (event) => {
        const value = event.target.value;
        const selectedFilter = Number(value);
        setTimeFilter(selectedFilter);
        const filteredNodes = filterNodes(allNodes, selectedFilter, groupFilter);
        console.log('時間篩選條件:', selectedFilter);
        setGraph({
            nodes: filteredNodes,
            edges: graph.edges,
        });
        setGraphKey(prevKey => prevKey + 1); // 更新 graphKey，強制刷新圖表
    };

    const handleGroupFilterChange = (event) => {
        const selectedGroup = event.target.value;
        setGroupFilter(selectedGroup);
        const filteredNodes = filterNodes(allNodes, timeFilter, selectedGroup);
        console.log('類型篩選條件:', selectedGroup);
        setGraph({
            nodes: filteredNodes,
            edges: graph.edges,
        });
        setGraphKey(prevKey => prevKey + 1); // 更新 graphKey，強制刷新圖表
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
        click_chatroom: (nodeid) => {
            console.log(`Graph:click:nodeid:`, nodeid);
            handleClickOpen(nodeid);
            sessionStorage.setItem('nodeId', nodeid);
        },
    };

    // 聊天室介面
    const Chat = ({ data }) => {
        // 將 nodes 轉換為字典，以便於查詢
        const nodesMap = data.nodes.reduce((acc, node) => {
            acc[node.id] = node;
            return acc;
        }, {});
        const uniqueEdges = data.edges.filter((edge, index, self) =>
            index === self.findIndex((e) => e.from === edge.from && e.to === edge.to)
          );

        return (
          <div style={{ margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', overflowY: 'auto', height: '85%' }}>
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
            {data.nodes.map(node => (
              
              <div 
                key={node.id} 
                nodeId={node.id} 
                style={{ margin: '10px 0', padding: '10px', borderRadius: '5px', backgroundColor: node.color.background, border: `1px solid ${node.color.border}` }}
                onClick={() => events.click_chatroom(node.id)}
                >
                {/* 檢查該訊息是根回覆 */}
                {uniqueEdges
                    .filter(edge => edge.from == node.id) // 找到回覆此訊息的邊
                    .map(edge => {
                    const replyNode = nodesMap[edge.to]; // 根據邊的 to 屬性獲取回覆的節點
                    return (
                        <div key={replyNode.id} style={{ marginTop: '10px', padding: '8px', borderRadius: '5px', backgroundColor: 'lightgray', color: 'gray', border: `1px solid ${replyNode.color.border}` }}>
                        <div><strong>{replyNode.label}</strong></div>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(replyNode.title) }} style={{ 
                            paddingBottom: '20px',
                        }}/>
                        <div style={{ fontSize: 'small', color: 'gray' }}>{new Date(replyNode.createdAt).toLocaleString()}</div>
                        </div>
                    );
                    })}

                {/* 節點內容 */}
                <div><strong>{node.label}</strong></div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(node.title) }} style={{ 
                        paddingBottom: '20px',
                }}/>
                <div style={{ fontSize: 'small', color: 'gray' }}>{new Date(node.createdAt).toLocaleString()}</div>
              
                
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
            {showNavbar && <ChatroomNavbar ws={ws} />}

            <div
                id="filter"
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 10000,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="timeFilter">時間範圍:</label>
                    <input
                        type="number"
                        id="timeFilter"
                        value={timeFilter}
                        onChange={handleTimeFilterChange}
                        style={{ marginLeft: '10px', width: '52px' }}
                        min="0"
                        placeholder="輸入分鐘"
                    />
                    <span style={{ marginLeft: '5px' }}>分鐘內</span>
                </div>
                <div>
                    <label htmlFor="groupFilter">篩選類型:</label>
                    <select
                        id="groupFilter"
                        value={groupFilter}
                        onChange={handleGroupFilterChange}
                        style={{ marginLeft: '10px' }}
                    >
                        <option value="all">全部</option>
                        <option value="idea">想法💡</option>
                        <option value="question">問題❓</option>
                        <option value="record">記錄📄</option>
                        <option value="experiment">實驗🧪</option>
                        <option value="information">資訊🔍</option>
                        <option value="reply">回覆💬</option>
                    </select>
                </div>
            </div>

            
            
                
            
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
                }}><Chat data={graph} />
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
            {/* 顯示已釘選節點的標識 */}
            {pinnedNodeId && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: '#FFFFFF', 
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px', 
                    }}
                >
                    <Button
                        variant="text"
                        onClick={() => {
                            if (groupId) {
                                removePinnedNode(groupId); 
                                setPinnedNodeId(null);
                                alert('已取消釘選');
                                window.dispatchEvent(new Event('pinnedNodeUpdated'));
                            }
                        }}
                        style={{
                            color: '#7D7DFF', 
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0', 
                            minWidth: 'auto',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        取消釘選
                    </Button>
                    <Button
                        variant="text"
                        onClick={handleViewPinned}
                        style={{
                            color: '#1976d2', // MUI primary blue color
                            backgroundColor: 'transparent',
                            border: 'none',
                            padding: '0', // 去除默認 padding
                            minWidth: 'auto', // 去除默認 min-width
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        回到釘選
                    </Button>
                </div>
            )}
        </div>
    );
}
