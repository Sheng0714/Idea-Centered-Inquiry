// import { useSignIn } from 'react-auth-kit';
// import config from '../config.json';
// import axios from "axios";
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
// import loginImg from '../assets/undraw_login_re_4vu2.svg';
// import url from '../url.json';

// export const Login = ({ open, setOpen, setOpenRegister }) => { 
//     const navigate = useNavigate();
//     const login = useSignIn();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [role, setRole] = useState('student');
//     const [data, setData] = useState({
//         email: "",
//         password: ""
//     });
//     useEffect(() => {
//         if (!open) return; 
//     }, [open]);
    
    
//     useEffect(() => {
//         // Checking if user is loggedIn
//         if(isLoggedIn && role === 'student'){
//             navigate("/home");
//         } else if (isLoggedIn && role === 'teacher'){
//             navigate("/teacher/home");
//         } else {
//             navigate("/");
//         }
//     }, [navigate, isLoggedIn, role]);




//     const handleChange = (e) => {
//         const value = e.target.value;
//         setData({
//             ...data,
//             [e.target.name]: value
//         });
//     };

//     const handleRoleChange = (event) => {
//       setRole(event.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // console.log("Hi")
//         const userData = {
//             email: data.email,
//             password: data.password
//         };
//         // console.log("userData: ", userData)
//         await axios
//             .post(url.backendHost + config[1].loginUrl, userData)
//             .then((response) => {
//                 setIsLoggedIn(true)
//                 setOpen(false);
//                 setData({
//                   email: "",
//                   password: ""
//                 })
                
//                 login({
//                     token: response.data.jwtToken,
//                     expiresIn: 3600,
//                     tokenType: "Bearer",
//                     authState: { ...response.data },
//                 });
//                 localStorage.setItem('jwtToken', response.data.jwtToken);
//                 localStorage.setItem('userId', response.data.id);
//                 localStorage.setItem('name', response.data.name);
//                 localStorage.setItem('email', response.data.email);
//                 alert("登入成功!");
//                 // console.log("res: ", response.data)
//             })
//             .catch((error) => {
//                 if (error.response === undefined) {
//                     alert("後端伺服器連結失敗");
//                     return;
//                 }else{
//                     switch (error.response.status) {
//                         case 401:
//                             alert("登入授權失敗 請確認帳號密碼");
//                             break;
//                         default:
//                             alert("未知錯誤 請聯絡管理員: "+error.response.status);
//                     }
//                 }
//             });
//     };
  
//     return (
//       <div>
//         <Dialog open={open} onClose={() => setOpen(false)}>
//             <div>
//                 <img src={loginImg} alt="Login Illustration" />
//             </div>
//             <DialogTitle>Login</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     id="name"
//                     label={"Please enter your email"}
//                     type="email"
//                     name='email'
//                     value={data.email}
//                     fullWidth
//                     variant="standard"
//                     onChange={handleChange}
//                 />
//                 <TextField
//                     margin="dense"
//                     id="name"
//                     label={"Please enter your password"}
//                     type="password"
//                     name='password'
//                     value={data.password}
//                     fullWidth
//                     variant="standard"
//                     onChange={handleChange}
//                 />
//                 {/*<FormControl>
//                     <FormLabel id="demo-row-radio-buttons-group-label">身分</FormLabel>
//                     <RadioGroup
//                         row
//                         aria-labelledby="demo-row-radio-buttons-group-label"
//                         name="row-radio-buttons-group"
//                         value={role}
//                         onChange={handleRoleChange}
//                     >
//                         <FormControlLabel value="teacher" control={<Radio />} label="老師" />
//                         <FormControlLabel value="student" control={<Radio />} label="學生" />
//                     </RadioGroup>
//                 </FormControl>*/}
//                <DialogContentText>
//                Don't have an account yet?
//                     <Link component="button" underline="none" onClick={() => { setOpen(false); setOpenRegister(true); }}>
//                     Register
//                 </Link>
//             </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//             <Button onClick={handleSubmit}>Login</Button>
//         </DialogActions>
//       </Dialog>
//       </div>
//     );
// }



import { useSignIn } from 'react-auth-kit';
import config from '../config.json';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import loginImg from '../assets/undraw_login_re_4vu2.svg';
import url from '../url.json';

export const Login = ({ open, setOpen, setOpenRegister }) => { 
    const navigate = useNavigate();
    const login = useSignIn();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('student'); // 預設為學生
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (!open) return; 
    }, [open]);

    useEffect(() => {
        // 根據登入狀態和角色跳轉頁面
        if (isLoggedIn) {
            if (role === 'student') {
                navigate("/kf");
            } else if (role === 'teacher') {
                navigate("/teacher/teacher_home");
            }
        }
    }, [navigate, isLoggedIn, role]);

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            email: data.email,
            password: data.password
        };
        await axios
            .post(url.backendHost + config[1].loginUrl, userData)
            .then((response) => {
                setIsLoggedIn(true);
                setOpen(false);
                setData({
                    email: "",
                    password: ""
                });
                
                login({
                    token: response.data.jwtToken,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: { ...response.data },
                });
                localStorage.setItem('jwtToken', response.data.jwtToken);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', role); // 儲存角色到 localStorage
                alert("Login Successful!");
            })
            .catch((error) => {
                if (!error.response) {
                    alert("後端伺服器連結失敗");
                    return;
                } else {
                    switch (error.response.status) {
                        case 401:
                            alert("登入授權失敗 請確認帳號密碼");
                            break;
                        default:
                            alert("未知錯誤 請聯絡管理員: " + error.response.status);
                    }
                }
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <div>
                    <img src={loginImg} alt="Login Illustration" />
                </div>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Please enter your email"
                        type="email"
                        name="email"
                        value={data.email}
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Please enter your password"
                        type="password"
                        name="password"
                        value={data.password}
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                    <FormControl component="fieldset" margin="dense">
                        <FormLabel component="legend">Role</FormLabel>
                        <RadioGroup
                            row
                            aria-label="role"
                            name="role"
                            value={role}
                            onChange={handleRoleChange}
                        >
                            <FormControlLabel value="student" control={<Radio />} label="Student" />
                            <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                        </RadioGroup>
                    </FormControl>
                    <DialogContentText>
                        Don't have an account yet?
                        <Link component="button" underline="none" onClick={() => { setOpen(false); setOpenRegister(true); }}>
                            Register
                        </Link>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>Login</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};