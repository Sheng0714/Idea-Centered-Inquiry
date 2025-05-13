import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import config from '../config.json';
import url from '../url.json';
import createActivityImg from '../assets/undraw_creative_thinking_re_9k71.svg';

const EditProfileModal = ({ open, onClose }) => {
    
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // 取出單個 Cookie

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId'); // 取得當前使用者 ID
            try {
                const response = await axios.get(url.backendHost + config[20].getUserUrl + userId);
                setUserData({
                    name: response.data.name,
                    // email: response.data.email,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        if (open) {
            fetchUserData();
        }
    }, [open]);

    const handleSave = async () => {
        if (!currentPassword) {
            setErrorMessage('請輸入當前密碼進行驗證');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            setErrorMessage('新密碼與確認密碼不一致');
            return;
        }

        const userId = localStorage.getItem('userId'); 
        try {

            await axios.put(url.backendHost + config[21].updateUserUrl + userId, {
                name: userData.name,
                // email: userData.email,
                currentPassword, 
                ...(newPassword && { password: newPassword }), 
            });

            alert('個人資料已更新成功');
            onClose(); 
        } catch (error) {
            console.error('Failed to update profile:', error);
            setErrorMessage(error.response?.data?.message || '更新失敗，請檢查密碼是否正確');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div>
                <img className='modal-image' src={createActivityImg} alt="Edit Profile" />
            </div>
            <DialogTitle sx={{ color: 'black', textDecoration: 'none' }}>編輯個人資料</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="姓名"
                    type="text"
                    name="name"
                    value={userData.name}
                    fullWidth
                    variant="standard"
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <TextField
                    margin="dense"
                    id="currentPassword"
                    label="當前密碼"
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    fullWidth
                    required
                    variant="standard"
                    onChange={(e) => setCurrentPassword(e.target.value)}                />
                <TextField
                    margin="dense"
                    id="newPassword"
                    label="新密碼"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    fullWidth
                    variant="standard"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="confirmPassword"
                    label="確認新密碼"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    fullWidth
                    variant="standard"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {errorMessage && (
                    <Typography color="error" variant="body2" mt={2}>
                        {errorMessage}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSave}>儲存</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;
