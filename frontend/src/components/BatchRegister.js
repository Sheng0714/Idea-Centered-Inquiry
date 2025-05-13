import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { UploadFile } from '@mui/icons-material'; // Upload icon
import url from '../url.json';
import config from '../config.json';
import joinActivityImg from '../assets/undraw_join_re_w1lh.svg';

export const BatchRegister = ({ callback_setActivities }) => {
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFile(null);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            alert("請選擇一個 Excel 文件進行批次註冊。");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        axios
            .post(`${url.backendHost + config[19].batchRegisterUrl}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                alert(response.data.message || "批次註冊成功！");
                setFile(null);
                setOpen(false);
            })
            .catch((error) => {
                alert(error.response?.data?.message || "批次註冊失敗，請確認文件格式。");
                setFile(null);
            });
    };

    return (
        <>
            <button className="import-student-button" onClick={handleClickOpen}>
                匯入學生
            </button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: { width: '350px' } 
                }}
            >
                <div>
                    <img className="modal-image" src={joinActivityImg} alt="匯入學生" />
                </div>
                <DialogTitle>批次匯入學生</DialogTitle>
                <DialogContent>
                <p>
                匯入學生資料請使用此
                <a
                    href="/example.xlsx"
                    download
                    style={{ color: 'green', textDecoration: 'underline' }}
                >
                    學生範例檔案
                </a>
                </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadFile />}
                        >
                            上傳文件
                            <input
                                type="file"
                                hidden
                                accept=".xlsx"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {file && <span>{file.name}</span>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        取消
                    </Button>
                    <Button type='submit' onClick={handleSubmit} color="primary">
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
