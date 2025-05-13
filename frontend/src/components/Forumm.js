import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config.json';
import io from 'socket.io-client';
import ForumPage_Navbar from './ForumPage_Navbar';
import Graph from "react-vis-network-graph";
import { ViewNode } from './ViewNode';
import url from '../url.json';
import { genEdge, genNode } from "../utils/ideaTool";




export default function Forumm({ showNavbar = true,groupId: initialGroupId  }) {
 
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

    const [open, setOpen] = useState(false);
    const [nodeContent, setNodeContent] = useState(null);
    const [ws, setSocket] = useState(null);
    const activityId = sessionStorage.getItem('activityId')
    const [groupId, setGroupId] = useState(initialGroupId || sessionStorage.getItem('groupId'));


    const handleClickOpen = (nodeId) => {
        setNodeContent(null);
        setOpen(true);
        fetchNodeData(nodeId);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchNodeData = async (nodeId) => {
        try {
            const response = await axios.get(`${url.backendHost + config[11].getOneNode}/${nodeId}`);
            setNodeContent(response.data);
            // console.log('Node Content: ', response.data);
        } catch (err) {
            // console.log(err);
        }
    };

    //取得 groupId, 並在其後 render getNodes()
    const fetchGroupData = async () => {
        const enterDifferentGroupEndpoint = `${url.backendHost}${config[16].EnterDifferentGroup}${sessionStorage.getItem('joinCode')}/${sessionStorage.getItem('userId')}`;
        const getMyGroupEndpoint = `${url.backendHost}${config[12].getMyGroup}/${sessionStorage.getItem('activityId')}/${sessionStorage.getItem('userId')}`;

        try {
            const response = await axios.get(enterDifferentGroupEndpoint);
            // console.log("1. groupData:response ", response.data.data[0].id);
            const groupId = response.data.data[0].id;
            localStorage.setItem('groupId', groupId);
            sessionStorage.setItem('groupId', groupId);
            setGroupId(groupId);
        } catch (error) {
            try {
                const response = await axios.get(getMyGroupEndpoint);
                // console.log("1. groupData:response ", response.data.data[0].id);
                const groupId = response.data.data[0].id;
                localStorage.setItem('groupId', groupId);
                sessionStorage.setItem('groupId', groupId);
                setGroupId(groupId);

            } catch (error) {
                console.error("Error fetching group data", error);
            }
        } finally {
            await getNodes();

        }
    };
    useEffect(() => {
        async function fetchData() {
            if (!initialGroupId) {
                await fetchGroupData();
            } else {
                setGroupId(initialGroupId);
            }
            setSocket(io.connect(url.socketioHost,{path: '/s/socket.io'}));
        }
        fetchData();
    }, [initialGroupId]);


    useEffect(() => {
        if (ws) {
          ws.on('connect', () => {
            console.log("WebSocket connected");
          });
    
          const nodeReceiveEvent = `node-recieve-${activityId}`;
          const edgeReceiveEvent = `edge-recieve-${activityId}`;
    
          ws.on(nodeReceiveEvent, handleNodeReceive);
          ws.on(edgeReceiveEvent, handleEdgeReceive);
    
          return () => {
            ws.off(nodeReceiveEvent, handleNodeReceive);
            ws.off(edgeReceiveEvent, handleEdgeReceive);
          };
        }
      }, [ws, groupId]);
    
      const handleNodeReceive = (body) => {
        if (body.groupId === groupId) {
          setGraph(graph => ({
            nodes: [...graph.nodes, genNode(body)],
            edges: graph.edges,
          }));
        }
      };
    
      const handleEdgeReceive = (body) => {
        if (body.groupId === groupId) {
          setGraph(graph => ({
            nodes: graph.nodes,
            edges: [...graph.edges, genEdge(body)],
          }));
        }
      };
    
      useEffect(() => {
        const handleStorageChange = () => {
          const newGroupId = sessionStorage.getItem('groupId');
          if (newGroupId !== groupId) {
            setGroupId(newGroupId);
          }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, [groupId]);
    
      useEffect(() => {
        if (groupId) {
          getNodes();
        }
      }, [groupId]);

      const getNodes = async () => {
        const fetchData = await axios.get(`${url.backendHost + config[8].getNode}/${groupId}`);

        const fetchEdge = await axios.get(`${url.backendHost + config[10].getEdge}/${groupId}`);

        const nodeData = fetchData.data[0].Nodes.map((node) => genNode(node));

        const edgeData = fetchEdge.data.map((edge) => genEdge(edge));

        //console.log('nodeData: ', nodeData);
        //console.log('edgeData: ', edgeData);
        sessionStorage.setItem("nodeDataLength", nodeData.length + 1);
        setGraph({
            nodes: nodeData,
            edges: edgeData,
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
                direction: 'RL',
                sortMethod: 'hubsize',
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
                bindToWindow: true
            },
            multiselect: false,
            selectable: true,
            selectConnectedEdges: true,
            tooltipDelay: 300,
            zoomSpeed: 1,
            zoomView: true
        },
        clickToUse: false,
        groups: {
            idea: {
                color: {
                    border: '#FFC',
                    background: '#FFC',
                    fontSize: 5,
                    highlight: {
                        border: '#FFC',
                        background: '#FFC'
                    }
                },
            },
            question: {
                color: {
                    border: '#CCF',
                    background: '#CCF',
                    highlight: {
                        border: '#CCF',
                        background: '#CCF'
                    }
                },
            },
            information: {
                color: {
                    border: '#CFC',
                    background: '#CFC',
                    highlight: {
                        border: '#CFC',
                        background: '#CFC'
                    }
                },
            },
            experiment: {
                color: {
                    border: '#FFDBDB',
                    background: '#FFDBDB',
                    highlight: {
                        border: '#FFDBDB',
                        background: '#FFDBDB'
                    }
                }
            },
            record: {
                color: {
                    border: '#B9DCF4',
                    background: '#B9DCF4',
                    highlight: {
                        border: '#B9DCF4',
                        background: '#B9DCF4'
                    }
                },
            },
            reply: {
                color: {
                    border: '#FFF',
                    background: '#FFF',
                    highlight: {
                        border: '#FFF',
                        background: '#FFF'
                    }
                },
            }
            // add more groups here
        },
        edges: {
            color: '#8B8B8B',
            width: 1,
            length: 600,
            // color: { inherit: 'from' },
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
            shape: 'box',
            borderWidth: 1,
            shapeProperties: {
                borderRadius: 1
            },
            color: {
                border: '#E3DFFD',
                background: '#E3DFFD',
                highlight: {
                    border: '#e3dffdcb',
                    background: '#e3dffdcb'
                },
                hover: {
                    border: '#e3dffdcb',
                    background: '#e3dffdcb'
                }
            },
            opacity: 1,
            fixed: {
                x: true,
                y: true
            },
            font: {
                color: '#343434',
                size: 2, // px
                face: 'arial',
                background: 'none',
                strokeWidth: 0, // px
                strokeColor: '#ffffff',
                align: 'left',
                multi: false,
                vadjust: 0,
                bold: {
                    color: '#343434',
                    size: 2, // px
                    face: 'arial',
                    vadjust: 0,
                    mod: 'bold'
                },
                ital: {
                    color: '#343434',
                    size: 5, // px
                    face: 'arial',
                    vadjust: 0,
                    mod: 'italic',
                },
                boldital: {
                    color: '#343434',
                    size: 5, // px
                    face: 'arial',
                    vadjust: 0,
                    mod: 'bold italic'
                },
                mono: {
                    color: '#343434',
                    size: 5, // px
                    face: 'courier new',
                    vadjust: 2,
                    mod: ''
                }
            },
            hidden: false,
            label: "HTML",
            level: undefined,
            margin: 10,
            shadow: {
                color: 'rgba(33,33,33,.7)',
                size: 10,
                x: 10,
                y: 10
            },
            heightConstraint: { minimum: 100, valign: 'middle' },
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
                    }
                    else {
                        let scale = 1 / (max - min);
                        return Math.max(0, (value - min) * scale);
                    }
                }
            },
            value: 1,
        },

    };

    const events = {
        click: (event) => {
            if (event.nodes.length === 1) {
                handleClickOpen(event.nodes[0]);
                sessionStorage.setItem('nodeId', event.nodes[0]);
            }
        }
    };

    return (
        <div className="home-container">
            {showNavbar && <ForumPage_Navbar ws={ws} />} {/* 根據 showNavbar 決定是否顯示 ForumPage_Navbar */}
            <div
                id="graph"
                style={{
                    flex: 1,
                    height: '100vh',
                    overflow: 'auto',
                    position: showNavbar ? 'fixed' : 'relative',
                    top: '0',
                    left: '0',
                    // marginLeft: '64px',
                }}
            >
                <Graph graph={graph} options={options} events={events} />
            </div>
            <ViewNode open={open} onClose={handleClose} nodeContent={nodeContent} ws={ws} />
        </div>
    );
}
