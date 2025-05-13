import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config.json';
import io from 'socket.io-client';
import url from '../url.json';



const MessageThread = ({ groupId }) => {
    const [data, setData] = useState({ nodes: [], edges: [] });
    const [expandedNodes, setExpandedNodes] = useState([]);
    const [ws, setSocket] = useState(null);
    const [tree, setTree] = useState([]);

    useEffect(() => {
        setSocket(io.connect(url.socketioHost,{path: '/s/socket.io'}));
    }, []);

    useEffect(() => {
        if (ws) {
            ws.on('connect', () => {
                console.log("WebSocket connected");
            });

            const activityId = sessionStorage.getItem('activityId');
            const nodeReceiveEvent = `node-receive-${activityId}`;
            const edgeReceiveEvent = `edge-receive-${activityId}`;

            //console.log(`Listening for ${nodeReceiveEvent} and ${edgeReceiveEvent}`);

            ws.on(nodeReceiveEvent, handleNodeReceive);
            ws.on(edgeReceiveEvent, handleEdgeReceive);

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            ws.on('disconnect', () => {
                console.log("WebSocket disconnected");
            });

            return () => {
                ws.off(nodeReceiveEvent, handleNodeReceive);
                ws.off(edgeReceiveEvent, handleEdgeReceive);
            };
        }
    }, [ws, groupId]);

    useEffect(() => {
        if (groupId) {
            setData({ nodes: [], edges: [] });
            fetchNodesAndEdges();
        }
    }, [groupId]);

    const fetchNodesAndEdges = async () => {
        try {
            const nodeResponse = await axios.get(`${url.backendHost + config[8].getNode}/${groupId}`);
            const edgeResponse = await axios.get(`${url.backendHost + config[10].getEdge}/${groupId}`);
            const nodes = nodeResponse.data[0].Nodes.map(node => ({
                ...node,
                id: String(node.id)  // Ensure id is a string
            }));
            const edges = edgeResponse.data.map(edge => ({
                ...edge,
                from: String(edge.from),
                to: String(edge.to)
            }));
            //console.log('Fetched nodes:', nodes);
            //console.log('Fetched edges:', edges);
            setData({ nodes, edges });
        } catch (error) {
            console.error('Error fetching nodes and edges:', error.message);
        }
    };

    useEffect(() => {
        const { nodes, edges } = data;
        //console.log('Updating tree with nodes and edges:', nodes, edges);
        const tree = buildTree(nodes, edges);
        //console.log('Updated tree:', tree);
        setTree(tree);
    }, [data]);

    const handleNodeReceive = (body) => {
        //console.log('Node received in MessageThread:', body);
        if (body.groupId == groupId) {
            const normalizedNode = {
                ...body,
                id: String(body.id),
                groupId: String(body.groupId),
                activityId: body.activityId ? String(body.activityId) : undefined,
                createdAt: body.createdAt || new Date().toISOString(),
                updatedAt: body.updatedAt || new Date().toISOString(),
            };
            setData(prevData => {
                const updatedNodes = [...prevData.nodes, normalizedNode];
                return { ...prevData, nodes: updatedNodes };
            });
        }
    };

    const handleEdgeReceive = (body) => {
        console.log('Edge received in MessageThread:', body);
        if (body.groupId == groupId) {
            const normalizedEdge = {
                ...body,
                groupId: String(body.groupId),
                from: String(body.from),
                to: String(body.to),
                activityId: body.activityId ? String(body.activityId) : undefined,
                createdAt: body.createdAt || new Date().toISOString(),
                updatedAt: body.updatedAt || new Date().toISOString(),
            };
            setData(prevData => {
                const updatedEdges = [...prevData.edges, normalizedEdge];
                return { ...prevData, edges: updatedEdges };
            });
        }
    };

    const buildTree = (nodes, edges) => {
        if (!Array.isArray(nodes) || !Array.isArray(edges)) return [];

        const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));

        edges.forEach(edge => {
            const parent = nodeMap.get(edge.to);
            const child = nodeMap.get(edge.from);
            if (parent && child) {
                child.level = (parent.level || 0) + 1;
                parent.children.push(child);
            }
        });

        const tree = [];
        nodeMap.forEach(node => {
            if (!edges.some(edge => edge.from === node.id)) {
                node.level = 0;
                tree.push(node);
            }
        });

        return tree;
    };

    const toggleExpand = (nodeId) => {
        if (expandedNodes.includes(nodeId)) {
            setExpandedNodes(expandedNodes.filter(id => id !== nodeId));
        } else {
            setExpandedNodes([...expandedNodes, nodeId]);
        }
    };

    const renderTree = (nodes) => {
        return nodes.map(node => (
            <div key={node.id} style={getStyle(node.level)}>
                <div style={headerStyle}>
                    <div style={authorStyle}>{node.title} - {node.author}</div>
                    <button onClick={() => toggleExpand(node.id)} style={buttonStyle}>
                        {expandedNodes.includes(node.id) ? '收起回覆' : '展開回覆'}
                    </button>
                </div>
                {expandedNodes.includes(node.id) && <div style={contentStyle}>{node.content}</div>}
                {expandedNodes.includes(node.id) && node.children && <div>{renderTree(node.children)}</div>}
            </div>
        ));
    };

    const getStyle = (level) => ({
        marginLeft: '0', 
        borderLeft: level > 0 ? '2px solid #ddd' : 'none', 
        padding: '10px',
        marginBottom: '10px',
        background: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        fontSize: '14px',
        position: 'relative'
    });

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    };

    const authorStyle = {
        fontWeight: 'bold', 
        color: '#333'
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        color: '#97CBFF', 
        cursor: 'pointer',
        fontSize: '12px'
    };

    const contentStyle = {
        marginTop: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        padding: '10px',
        fontSize: '14px',
        color: '#666'
    };
    const containerStyle = {
        width: '90%',
        height: '85%',
        overflow: 'auto',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        position: 'relative'
    };
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center', fontSize: '22px', color: '#333' }}>想法串</h2>
            <div style={containerStyle}>
                {renderTree(tree)}
            </div>
        </div>
    );
};

export default MessageThread;
