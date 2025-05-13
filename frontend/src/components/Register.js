import config from '../config.json';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link , IconButton } from '@mui/material';
import registerImg from '../assets/undraw_mobile_payments_re_7udl.svg';
import { Login } from './Login';
import url from '../url.json';
import { UploadFile } from '@mui/icons-material'; // Upload icon

export const Register = ({ open, setOpen, setOpenLogin }) => { 
    const [file, setFile] = useState(null); // File state for batch registration
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        passwordConf: "",
        school: "",
        city: ""
    });


    const handleClose = () => {
        setOpen(false);
        setFile(null);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name: data.name,
            email: data.email,
            password: data.password,
            passwordConf: data.passwordConf,
            school: data.school,
            city: data.city
        };
        axios
            .post(url.backendHost + config[0].registerUrl, userData)
            .then((response) => {
                setOpen(false);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    passwordConf: "",
                    school: "",
                    city: ""
                })
                // alert("註冊成功！");
                alert("Registration Successful!");
                // console.log(response.status, response.data);
            })
            .catch((error) => {
                // alert(error.response?.data?.message || "註冊失敗，請重試！");
                alert(error.response?.data?.message || "Registration failed. Please try again!");
                if (error.response) {
                    // console.log(error.response);
                    // console.log("server responded");
                } else if (error.request) {
                    // console.log("network error");
                } else {
                    // console.log(error);
                }
            });
    };
    const handleBatchSubmit = () => {
        if (!file) {
            alert("請選擇一個 Excel 文件進行批次註冊。");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        axios
            .post(url.backendHost + config[19].batchRegisterUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                alert(response.data.message || "批次註冊成功！");
                setFile(null);
                handleClose();
            })
            .catch((error) => {
                alert(error.response?.data?.message || "批次註冊失敗，請確認文件格式。");
                setFile(null);
            });
    };
    return (
      <div>
       <Dialog open={open} onClose={() => setOpen(false)}>
       <div>
              <img className='modal-image' src={registerImg} />
            </div>
            <DialogTitle>Register an Account</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    // label={"請填寫您的姓名"}
                    label={"Please enter your name"}
                    type="text"
                    name='name'
                    value={data.name}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="name"
                    // label={"請填寫信箱"}
                    label={"Please enter your email address"}
                    type="email"
                    name='email'
                    value={data.email}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="name"
                    // label={"請填寫密碼"}
                    label={"Please enter your password"}
                    type="password"
                    name='password'
                    value={data.password}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="name"
                    // label={"請填入確認密碼，確認密碼必須與上面的「密碼」相同"}
                    label={"Please enter the confirmation password"}
                    type="password"
                    name='passwordConf'
                    value={data.passwordConf}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
                {/* <TextField
                    margin="dense"
                    id="name"
                    label={"請填寫目前就讀的學校"}
                    type="text"
                    name='school'
                    value={data.school}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                /> */}
                {/* <TextField
                    margin="dense"
                    id="name"
                    label={"請填寫所在城市"}
                    type="text"
                    name='city'
                    value={data.city}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                /> */}
                <DialogContentText>
                    Already have an account?
                    <Link component="button" underline="none" onClick={() => { setOpen(false); setOpenLogin(true); }}>
                    Login
                </Link>
            </DialogContentText>
                            <DialogContentText>
                    或者選擇 Excel 文件進行批次註冊：
                </DialogContentText>
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
            <Button onClick={handleSubmit}>Register</Button>
            <Button onClick={handleBatchSubmit} color="secondary">批次註冊</Button>
        </DialogActions>
      </Dialog>
      </div>
    );
}