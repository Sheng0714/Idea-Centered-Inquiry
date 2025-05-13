import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import io from 'socket.io-client';
import config from '../config.json';
import url from '../url.json';
import SimpleNavbar from '../components/SimpleNavbar';
import Forumm from '../components/Forumm';
import MessageThread from '../components/MessageThread';



export default function Dashboard() {
    const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
    const [data, setData] = useState({ nodes: [], edges: [] });
    const [groupIds, setGroupIds] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(sessionStorage.getItem('groupId'));
    const [displayConfig, setDisplayConfig] = useState({
        showMonitor: true,
        showMessageThread: true,
        showCharts: true
    });

    const toggleDisplay = (key) => {
        setDisplayConfig(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        if (key === 'showCharts' && !displayConfig.showCharts) {
            setTimeout(renderCharts, 100); // 延遲渲染圖表以確保DOM已更新
        }
    };

    useEffect(() => {
        const storedGroupIds = JSON.parse(localStorage.getItem('groupIds') || '[]');
        setGroupIds(storedGroupIds);

        if (!sessionStorage.getItem('groupId') && storedGroupIds.length > 0) {
            sessionStorage.setItem('groupId', storedGroupIds[0]);
            setSelectedGroupId(storedGroupIds[0]);
        }
    }, []);

    useEffect(() => {
        if (ws) {
            initWebSocket();
        }
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            getNodes();
        }
    }, [selectedGroupId]);

    useEffect(() => {
        if (data.nodes.length > 0 && displayConfig.showCharts) {
            renderCharts();
        }
    }, [data, displayConfig.showCharts]);

    const handleGroupChange = (event) => {
        const newGroupId = event.target.value;
        setSelectedGroupId(newGroupId);
        sessionStorage.setItem('groupId', newGroupId);
        clearCharts();
        getNodes();
    };

    const getNodes = async () => {
        try {
            const response = await axios.get(`${url.backendHost + config[8].getNode}/${sessionStorage.getItem('groupId')}`);

            //console.log("fetchData: ", response.data[0].Nodes);
            setData(prevData => ({ nodes: response.data[0].Nodes, edges: prevData.edges }));
        } catch (error) {
            console.error('Error fetching nodes:', error.message);
        }
    };

    const initWebSocket = () => {
        ws.on('connect', () => {
            console.log('WebSocket connected');
            getNodes();
        });

        ws.on(`node-recieve-${sessionStorage.getItem('activityId')}`, handleNodeReceive);
        ws.on(`edge-recieve-${sessionStorage.getItem('activityId')}`, handleEdgeReceive);
    };

    const handleNodeReceive = (body) => {
        console.log('Node received:', body);
        if (body.groupId == sessionStorage.getItem('groupId')) {
            const normalizedNode = {
                ...body,
                groupId: parseInt(body.groupId, 10),
                activityId: body.activityId ? parseInt(body.activityId, 10) : undefined,
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
        console.log('Edge received:', body);
        if (body.groupId == sessionStorage.getItem('groupId')) {
            const normalizedEdge = {
                ...body,
                groupId: parseInt(body.groupId, 10),
                activityId: body.activityId ? parseInt(body.activityId, 10) : undefined,
                createdAt: body.createdAt || new Date().toISOString(),
                updatedAt: body.updatedAt || new Date().toISOString(),
            };
            setData(prevData => {
                const updatedEdges = [...prevData.edges, normalizedEdge];
                return { ...prevData, edges: updatedEdges };
            });
        }
    };

    useEffect(() => {
        if (data.nodes.length > 0) {
            renderCharts();
        }
    }, [data]);

    const clearCharts = () => {
        const chartIds = ['tag-chart', 'author-tag-chart', 'cumulative-chart', 'radar-chart'];
        chartIds.forEach(id => ApexCharts.exec(id, "destroy"));
    };

    const renderCharts = () => {
        clearCharts(); // 清除先前的圖表
        const nodes = data.nodes;
        renderTagChart(nodes);
        renderAuthorTagChart(nodes);
        renderCumulativeChart(prepareSeries(prepareData(nodes)));
        const authorKeywordCount = countKeywords(nodes);
        renderRadarChart(authorKeywordCount);
    };

    const renderTagChart = (nodes) => {
        const tagsCounter = TagsCounter(nodes);
        const options = {
            chart: {
                id: 'tag-chart',
                type: 'bar',
                colors: ['#FFFFCC', '#CCFFCC', '#CCCCFF', '#FFDBDB', '#D0F4FF', '#FFFFFF'], 
            },
            series: [{
                name: '標籤數量',
                data: tagsCounter,
            }],
            xaxis: {
                categories: ['想法', '資訊', '提問', '實驗', '紀錄', '回覆'],
            },
            title: {
                text: '累計標籤圖',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '20px',
                    color: '#333'
                }
            }
        };
        renderChart("#tag-chart", options);
    };

    const tagMapping = {
        idea: '想法',
        information: '資訊',
        question: '提問',
        experiment: '實驗',
        record: '紀錄',
        reply: '回覆'
    };

    const renderAuthorTagChart = (nodes) => {
        const authorTagCount = nodes.reduce((acc, node) => {
            if (!acc[node.author]) {
                acc[node.author] = {
                    idea: 0,
                    information: 0,
                    question: 0,
                    experiment: 0,
                    record: 0,
                    reply: 0,
                };
            }
            acc[node.author][node.tags]++;
            return acc;
        }, {});

        const authors = Object.keys(authorTagCount);
        const dataSeries = Object.keys(tagMapping).map(tag => ({
            name: tagMapping[tag],
            data: authors.map(author => authorTagCount[author][tag]),
        }));

        const options = {
            chart: {
                id: 'author-tag-chart',
                type: 'bar',
            },
            series: dataSeries,
            xaxis: {
                categories: authors,
            },
            title: {
                text: '個人標籤圖',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '20px',
                    color: '#333'
                }
            }
        };

        renderChart("#author-tag-chart", options);
    };

    const renderRadarChart = (authorKeywordCount) => {
        const categories = ["我的想法", "我覺得更好的想法", "我想知道", "這個想法不能解釋", "舉例和參考來源", "我的總結"];
        const seriesData = Object.keys(authorKeywordCount).map(author => ({
            name: author,
            data: categories.map(keyword => Math.ceil(authorKeywordCount[author][keyword])),
        }));

        const options = {
            chart: {
                id: 'radar-chart',
                type: 'radar',
            },
            series: seriesData,
            xaxis: {
                categories: categories,
            },
            yaxis: {
                labels: {
                    formatter: value => Math.round(value).toString(),
                },
                min: 0,
                tickAmount: 4,
            },
            dataLabels: {
                enabled: false,
            },
            title: {
                text: '鷹架數量圖',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '20px',
                    color: '#333'
                }
            }
        };

        renderChart("#radar-chart", options);
    };

    const renderCumulativeChart = (series) => {
        //console.log('Series Data for Cumulative Chart:', series);

        const options = {
            chart: {
                id: 'cumulative-chart',
                type: 'line'
            },
            series: series,
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Updated At'
                }
            },
            yaxis: {
                title: {
                    text: 'Cumulative Nodes'
                }
            },
            title: {
                text: '累計節點時間圖',
                align: 'center',
                margin: 10,
                style: {
                    fontSize: '20px',
                    color: '#333'
                }
            }
        };

        renderChart("#cumulative-chart", options);
    };

    const renderChart = (selector, options) => {
        const chartElement = document.querySelector(selector);
        if (chartElement) {
            const chart = new ApexCharts(chartElement, options);
            chart.render();
        } else {
            console.error(`${selector} element not found`);
        }
    };

    const prepareData = (nodes) => {
        nodes.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

        const authorCumulativeCount = {};
        const seriesData = {};

        nodes.forEach(node => {
            const { author, updatedAt } = node;
            if (!author) {
                console.error('Node author is missing:', node);
                return;
            }
            if (!authorCumulativeCount[author]) {
                authorCumulativeCount[author] = 0;
                seriesData[author] = [];
            }
            authorCumulativeCount[author]++;
            seriesData[author].push({
                x: new Date(updatedAt),
                y: authorCumulativeCount[author]
            });
        });

        return seriesData;
    };

    const prepareSeries = (seriesData) => {
        return Object.keys(seriesData).map(author => {
            if (author === undefined || author === null) {
                console.error('Author is undefined or null:', seriesData);
                return { name: 'Unknown Author', data: seriesData[author] };
            }
            return {
                name: author,
                data: seriesData[author]
            };
        });
    };

    const countKeywords = (nodes) => {
        const keywords = ["我的想法", "我覺得更好的想法", "我想知道", "這個想法不能解釋", "舉例和參考來源", "我的總結"];
        const authorKeywordCount = {};

        nodes.forEach(node => {
            const { author, content } = node;
            if (content && typeof content === 'string') {
                if (!authorKeywordCount[author]) {
                    authorKeywordCount[author] = {
                        "我的想法": 0,
                        "我覺得更好的想法": 0,
                        "我想知道": 0,
                        "這個想法不能解釋": 0,
                        "舉例和參考來源": 0,
                        "我的總結": 0
                    };
                }
                keywords.forEach(keyword => {
                    if (content.includes(keyword)) {
                        authorKeywordCount[author][keyword]++;
                    }
                });
            }
        });

        return authorKeywordCount;
    };

    const TagsCounter = (inputs) => {
        const counter = {
            idea: 0,
            information: 0,
            question: 0,
            experiment: 0,
            record: 0,
            reply: 0,
        };

        inputs.forEach(input => {
            counter[input.tags]++;
        });

        return [counter.idea, counter.information, counter.question, counter.experiment, counter.record, counter.reply];
    };

    return (
        <div className="container" style={{}}>
            <SimpleNavbar />
            <div className="dropdown-container" >
                <label htmlFor="group-select" style={{
                    marginRight: '10px',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '22px'
                }}>
                    目前所在的小組為
                </label>
                <select id="group-select" value={selectedGroupId} onChange={handleGroupChange} style={{
                    fontSize: '1em',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '5px'
                }}>
                    {groupIds.map((groupId, index) => (
                        <option key={groupId} value={groupId}>
                            第{index + 1}組
                        </option>
                    ))}
                </select>
                <div className="toggle-buttons" style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                    {/* <button className="toggle-button" onClick={() => toggleDisplay('showMessageThread')}>想法串</button>
            <button className="toggle-button" onClick={() => toggleDisplay('showCharts')}>儀錶板</button> */}
                    <button className="toggle-button" onClick={() => toggleDisplay('showMonitor')}>
                        {displayConfig.showMonitor ? '隱藏監控版' : '顯示監控版'}
                    </button>
                </div>
            </div>
            <div className="home-container" style={{ display: 'flex', flexDirection: 'row', marginLeft: '60px' }}>
                {displayConfig.showMessageThread && (
                    <div style={{ flex: 0.35, display: 'flex', justifyContent: 'center' }}>
                        <MessageThread groupId={selectedGroupId} />
                    </div>
                )}
                {displayConfig.showCharts && (
                    <div style={{ flex: 0.65, display: 'flex', flexDirection: 'column' }}>
                        <div className="chart-row" style={{ marginBottom: '10px', flex: 1 }}>
                            <div id="cumulative-chart" className="chart-container" style={{ height: '40vh', flex: 1 }}></div>
                            <div id="radar-chart" className="chart-container" style={{ height: '40vh', flex: 1 }}></div>
                        </div>
                        <div className="chart-row" style={{ flex: 1 }}>
                            <div id="tag-chart" className="chart-container" style={{ height: '40vh', flex: 1 }}></div>
                            <div id="author-tag-chart" className="chart-container" style={{ height: '40vh', flex: 1 }}></div>
                        </div>
                    </div>
                )}
            </div>
            {displayConfig.showMonitor && (
                <div className="home-container" style={{ display: 'flex', flexDirection: 'row' }}>
                    {selectedGroupId && (
                        <div style={{
                            border: '2px solid #ccc',
                            borderRadius: '10px',
                            padding: '10px',
                            margin: '10px',
                            width: 'calc(100% - 120px)',  
                            marginLeft: '90px',
                            justifyContent: 'center',
                            overflow: 'hidden',  
                            boxSizing: 'border-box'  
                        }}>
                            <h2 style={{ textAlign: 'center', fontSize: '22px', color: '#333' }}>即時監控畫面</h2>
                            <Forumm showNavbar={false} groupId={selectedGroupId} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
