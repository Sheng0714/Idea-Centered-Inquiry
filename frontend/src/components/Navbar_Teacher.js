import React, { useState } from 'react';
import { Button, Container } from "@mui/material";
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import Logo from "../assets/LOGO-removebg-preview.png";
import { HiOutlineBars3 } from 'react-icons/hi2';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from "@mui/material"
import { Box } from '@mui/system';
import { Register } from './Register';
import { Login } from './Login'

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate(); // 使用 useNavigate 進行導航
  const role = localStorage.getItem("role") || "student";
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => navigate('/teacher/teacher_home') // 跳轉到 教師Home 頁面
    },
    {
      text: "About",
      icon: <InfoIcon />,
      onClick: () => navigate('/About_teacher') // 跳轉到 About 頁面
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
const handleKFTEACHERClick = () => {
    navigate("/kf_teacher");  // 跳轉到 /kfweb 頁面
};

  return (
    <nav>
      <div className='nav-logo-container'>
        <img alt='' src={Logo} width={150} height={120} />
        <p style={{ marginLeft: '150px', position: 'relative', top: '-75px', fontSize: '24px' }}>
          Collaborative Argumentation and Writing System
        </p>
      </div>

      <div className="navbar-links-container">
        <a href="" onClick={() => navigate('/teacher/teacher_home')}>Home</a> {/* 使用 navigate 進行跳轉 */}
        <a href="" onClick={() => navigate('/About_teacher')}>About</a> {/* 使用 navigate 進行跳轉 */}
        <a href="" style={{ marginRight: '15px' }}>Manual</a>
        <a href="" onClick={() => navigate('/')}>logout</a> {/* 使用 navigate 進行跳轉 */}
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: "20px" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleKFTEACHERClick}  // 點擊 KF 按鈕跳轉到 /kfweb
                                >
                                    KF
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleStudentlist}
                                >
                                    查看學生學習狀況
                                </Button>
                            </div>

      <div className='navbar-menu-container'>
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={item.onClick}> {/* 點擊時調用 onClick 進行導航 */}
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
}