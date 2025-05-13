import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import url from '../url.json';
import config from '../config.json';

const AnnouncementPopup = ({ groupId, networkRef, open }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [ws, setSocket] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(
                    `${url.backendHost}${config[8].getNode}/${groupId}`,
                    {
                        headers: { authorization: "Bearer JWT Token" },
                    }
                );
                const nodes = response.data[0].Nodes;
                const filteredAnnouncements = nodes
                    .filter(node => node.content.includes('【公告】'))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAnnouncements(filteredAnnouncements);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };
    
        if (groupId) {
            fetchAnnouncements();
        }
    
        const socket = io(url.socketioHost,{path: '/s/socket.io'});
        setSocket(socket);
    
        socket.on("connect", () => {
            console.log("AnnouncementPopup - WebSocket connected");
        });
    
        socket.on(`announcement-${groupId}`, (newAnnouncement) => {
            console.log("Received Announcement:", newAnnouncement);
            window.location.reload();
            setAnnouncements((prev) => {
                const updatedAnnouncements = [newAnnouncement, ...prev];
                return updatedAnnouncements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            });
        });
    
        return () => {
            socket.disconnect();
            console.log("AnnouncementPopup - WebSocket disconnected");
        };
    }, [groupId]);
    

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
        markCurrentAsRead();
    };

    const markCurrentAsRead = () => {
        if (announcements.length > 0) {
            const updatedAnnouncements = [...announcements];
            updatedAnnouncements[currentAnnouncementIndex].isRead = true;
            setAnnouncements(updatedAnnouncements);
        }
    };

    const hasUnreadAnnouncements = announcements.some(announcement => !announcement.isRead);

    const nextAnnouncement = () => {
        if (currentAnnouncementIndex < announcements.length - 1) {
            setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
        }
    };

    const prevAnnouncement = () => {
        if (currentAnnouncementIndex > 0) {
            setCurrentAnnouncementIndex(currentAnnouncementIndex - 1);
        }
    };

    const handleViewAnnouncement = () => {
        const currentAnnouncement = announcements[currentAnnouncementIndex];
        const nodeId = String(currentAnnouncement.id);
        console.log("Trying to focus node:", nodeId);

        // 聚焦到选中的节点
        if (networkRef?.current) {
            const allNodes = networkRef.current.body.nodes; // 獲取圖表中的所有節點
            if (allNodes[nodeId]) {
                // 如果節點存在於圖表中，聚焦
                networkRef.current.focus(nodeId, { scale: 1.5, offset: { x: 0, y: 0 } });
            } else {
                alert('節點未在圖表中顯示');
            }
        } else {
            console.error('Network reference not initialized or missing');
        }
    };

    const getTagIcon = (tag) => {
        switch (tag) {
            case 'idea': return '💡';
            case 'question': return '❓';
            case 'record': return '📄';
            case 'experiment': return '🧪';
            case 'information': return '🔍';
            default: return '';
        }
    };

    return (
        <>
            <button
                id="announcementBtn"
                onClick={togglePopup}
                disabled={open}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: open ? '#d3d3d3' : hasUnreadAnnouncements ? '#ff5252' : '#ccc',
                    color: open ? '#7d7d7d' : 'white',                    fontSize: '24px',
                    cursor: open ? 'not-allowed' : 'pointer', // 禁用時顯示不可點擊樣式
                    zIndex: 99999,
                    border: 'none',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                🔔
            </button>

            {isPopupVisible && announcements.length > 0 && (
                <div
                    id="announcementPopup"
                    style={{
                        position: 'fixed',
                        top: '88px',
                        right: '28px',
                        width: '260px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '0px 20px 20px',
                        zIndex: 1000,
                    }}
                >
                    <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '0px' }}>公告</h3>
                    <div style={{ padding: '10px 20px' }}>
                        <strong>
                            {getTagIcon(announcements[currentAnnouncementIndex].tags)}{' '}
                            {announcements[currentAnnouncementIndex].title}
                        </strong>
                        <p>{announcements[currentAnnouncementIndex].author}</p>
                        <p>{new Date(announcements[currentAnnouncementIndex].createdAt).toLocaleString()}</p>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center', 
                            gap: '20px', 
                            marginTop: '20px', 
                        }}
                    >
                        <button
                            onClick={prevAnnouncement}
                            disabled={currentAnnouncementIndex === 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: currentAnnouncementIndex === 0 ? 'gray' : '#1976d2',
                                cursor: currentAnnouncementIndex === 0 ? 'default' : 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                            }}
                        >
                            ＜上一則
                        </button>
                        <button
                            onClick={handleViewAnnouncement}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#1976d2',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                            }}
                        >
                            前往
                        </button>
                        <button
                            onClick={nextAnnouncement}
                            disabled={currentAnnouncementIndex === announcements.length - 1}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: currentAnnouncementIndex === announcements.length - 1 ? 'gray' : '#1976d2',
                                cursor: currentAnnouncementIndex === announcements.length - 1 ? 'default' : 'pointer',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                            }}
                        >
                            下一則＞
                        </button>
                    </div>

                    
            </div>
        )}
        </>
    );
};

export default AnnouncementPopup;
