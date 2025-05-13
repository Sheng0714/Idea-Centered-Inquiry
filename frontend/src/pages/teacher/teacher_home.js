import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect
//import Logo from "../assets/new_logo_1.png";
import { HiOutlineBars3 } from 'react-icons/hi2';
import { List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from "@mui/material"
import { Box } from '@mui/system';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { Register } from '../../components/Register';
import { Login } from '../../components/Login'
// import Navbar from "../components/HomePage_Navbar";
import Navbar from "../../components/Navbar_Teacher";

export const Teacher_Home = () => {
    const navigate = useNavigate();  // 使用 navigate 來進行路由導航
    const role = localStorage.getItem("role") || "student";
    const [userName, setUserName] = useState('');  // 用來儲存用戶姓名
    const [openMenu, setOpenMenu] = useState(false);

    const menuOptions = [
        {
          text: "Home",
          icon: <HomeIcon />,
          onClick: () => navigate('/') // 跳轉到 Home 頁面
        },
        {
          text: "About",
          icon: <InfoIcon />,
          onClick: () => navigate('/about') // 跳轉到 About 頁面
        },
        {
          text: "Login",
          icon: <Login />,
          onClick: () => navigate('/login') // 跳轉到 Login 頁面
        },
        {
          text: "Register",
          icon: <Register />,
          onClick: () => navigate('/register') // 跳轉到 Register 頁面
        }
    ];

    // 跳轉到 Writing Area 頁面
    const handleStudentlist = () => {
        if (role === "teacher") {
            // navigate("/teacher/home");  // 根據角色跳轉到不同頁面
            navigate("/teacher/home");  // 根據角色跳轉到不同頁面
        } else {
            // navigate("/home");
            navigate("/teacher/home");  // 根據角色跳轉到不同頁面
        }
    };

    // 點擊 KF 按鈕時跳轉到 /kfweb 路徑
    const handleKFClick = () => {
        navigate("/kfweb");  // 跳轉到 /kfweb 頁面
    };

    // 點擊 KF 按鈕時跳轉到 /kfweb 路徑
    const handleSet_tasksClick = () => {
        navigate("/teacher/home");  // 跳轉到 /kfweb 頁面
    };


    useEffect(() => {
        const name = localStorage.getItem('name');  // 從 localStorage 讀取姓名
        if (name) {
            setUserName(name);  // 設置姓名到 state
        }
    }, []);

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-banner-container">
                <div className="home-text-section">
                    <h1 className="primary-heading">
                        Inspire Thinking
                        <br />
                        Write Infinite Possibilities
                        <br />
                        with AI
                    </h1>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', marginRight: '-150px', marginTop: '80px', width: '500px', margin: '0 auto' }}>
                    <form>
                        <Container style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            {/* 新增容器包裹 Welcome 和 按鈕 */}
                            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                              <br/><br/>
                                <h1>Welcome to Teacher {userName ? userName : 'KF Interface'}</h1>  {/* 顯示姓名或默認文字 */}
                            </div>
                              <br/><br/><br/>
                            {/* 包裹按鈕的容器，確保兩個按鈕在同一區塊內顯示 */}
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "20px" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleKFClick}  // 點擊 KF 按鈕跳轉到 /kfweb
                                >
                                    KF
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSet_tasksClick}
                                >
                                    設定任務
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleStudentlist}
                                >
                                    查看學生學習狀況
                                </Button>
                            </div>
                        </Container>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Teacher_Home;