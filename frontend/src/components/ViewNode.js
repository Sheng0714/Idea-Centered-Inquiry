import React, { useState } from 'react';
import config from '../config.json';
import axios from "axios";
import { v4 as uuid } from 'uuid';
import { Button as MuiButton, Tooltip, IconButton, Box, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Divider, TextField } from '@mui/material';
import { Button as BaseButton } from '@mui/base';
import { CreateReply } from './CreateReply';
import DOMPurify from 'dompurify'; // 新增
import { setPinnedNode, removePinnedNode } from '../utils/pinnedNodes'; // 新增

export const ViewNode = ({ open, onClose, nodeContent, ws, groupId }) => { // 接收 groupId
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setId] = useState('');

    const formatTimestamp = (timestamp) => {
        return new Intl.DateTimeFormat('zh-TW', { // 修改為繁體中文
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            //   second: 'numeric',
            hour12: false,
        }).format(new Date(timestamp));
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleReply = async (e) => {
        onClose();
        openModal();
    };
    const handlePin = () => {
        if (nodeContent && nodeContent.id && groupId) {
            setPinnedNode(groupId, nodeContent.id); // 使用 groupId 設置釘選節點
            alert(`已釘選節點: ${nodeContent.title}`);
            onClose();
            window.dispatchEvent(new Event('pinnedNodeUpdated'));
        }
    };

    const handleUnpin = () => {
        if (nodeContent && nodeContent.id && groupId) {
            removePinnedNode(groupId); // 使用 groupId 移除釘選節點
            alert(`已取消釘選節點: ${nodeContent.title}`);
            onClose();
            // 通知父组件更新钉选状态
            window.dispatchEvent(new Event('pinnedNodeUpdated'));
        }
    };

    // 修改 isPinned 判斷，使用 group-specific key
    const pinnedNodes = JSON.parse(localStorage.getItem('pinnedNodes') || '{}');
    const isPinned = nodeContent && nodeContent.id === pinnedNodes[groupId];

    console.log('ViewNode - groupId:', groupId);
    console.log('ViewNode - isPinned:', isPinned);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                scroll='body'
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {nodeContent && nodeContent.title}
                        <Tooltip title={isPinned ? "取消釘選" : "釘選"}>
                            <IconButton
                                onClick={isPinned ? handleUnpin : handlePin}
                                aria-label={isPinned ? "取消釘選" : "釘選"}
                                sx={{
                                    color: 'primary.main',
                                    padding: 0,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                📌
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>
                <Divider variant="middle" />
                <DialogContent id="nodeWindow">
                    <DialogContentText id="alert-dialog-description">
                        {nodeContent && (
                            <>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(nodeContent.content)
                                    }}
                                />
                                <br/>
                                <br/>
                                <div>作者：{nodeContent.author}</div>
                                <br />
                                <div>撰寫時間：{formatTimestamp(nodeContent.createdAt)}</div>
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={handleReply}
                        variant="text"
                        color="primary"
                        sx={{
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        回覆
                    </MuiButton>
                    <MuiButton
                        onClick={onClose}
                        variant="text"
                        color="primary"
                        sx={{
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        取消
                    </MuiButton>
                </DialogActions>
            </Dialog>
            <CreateReply
                open={modalOpen}
                onClose={closeModal}
                nodeContent={nodeContent}
                ws={ws}
            />
        </>
    );
}