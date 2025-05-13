
// import { useNavigate } from "react-router-dom";
// import { Button, Container } from "@mui/material";
// import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect


// export const KF = () => {
//     const navigate = useNavigate();
//     const role = localStorage.getItem("role") || "student";
//     const [userName, setUserName] = useState('');

//     const handleWriteArea = () => {
//         if (role === "teacher") {
//             navigate("/teacher/home");
//         } else {
//             navigate("/home");
//         }
//     };


//     useEffect(() => {
//         const name = localStorage.getItem('name'); // 從 localStorage 讀取姓名
//         if (name) {
//             setUserName(name); // 設置姓名到 state
//         }
//     }, []);

//     return (
//         <Container style={{ textAlign: "center", marginTop: "50px" }}>
//             <h1>Welcome to {userName ? userName : 'KF Interface'}</h1>
//             <Button
//                 variant="contained"
//                 color="primary"
//                 style={{ margin: "10px" }}
//                 onClick={() => alert("KF 按鈕被點擊！")}
//             >
//                 KF
//             </Button>
//             <Button
//                 variant="contained"
//                 color="secondary"
//                 style={{ margin: "10px" }}
//                 onClick={handleWriteArea}
//             >
//                 寫作區
//             </Button>
//         </Container>
//     );
// };

// // 確保這行存在於 `kf.js` 中
// export default KF;



// import { useNavigate } from "react-router-dom";
// import { Button, Container } from "@mui/material";
// import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect

// export const KF = () => {
//     const navigate = useNavigate();
//     const role = localStorage.getItem("role") || "student";
//     const [userName, setUserName] = useState('');  // 用來儲存用戶姓名

//     const handleWriteArea = () => {
//         if (role === "teacher") {
//             navigate("/teacher/home");  // 根據角色跳轉到不同頁面
//         } else {
//             navigate("/home");
//         }
//     };

//     useEffect(() => {
//         const name = localStorage.getItem('name');  // 從 localStorage 讀取姓名
//         if (name) {
//             setUserName(name);  // 設置姓名到 state
//         }
//     }, []);

//     return (
//         <Container 
//             style={{
//                 textAlign: "center", 
//                 position: "absolute",  // 使容器定位
//                 top: "50%",  // 垂直居中
//                 left: "1000px",  // 水平居中
//                 transform: "translate(-50%, -50%)",  // 移動容器至正中間
//                 backgroundColor: "#FFEBCC", 
//                 padding: "20px", 
//                 width: "40%",  // 限制容器寬度
//                 borderRadius: "8px",  // 增加圓角效果
//             }}
//         >
//             {/* 新增容器包裹 Welcome 和 按鈕 */}
//             <div style={{ marginBottom: "20px" }}>
//                 <h1>Welcome to {userName ? userName : 'KF Interface'}</h1>  {/* 顯示姓名或默認文字 */}
//             </div>
            
//             {/* 包裹按鈕的容器，確保兩個按鈕在同一區塊內顯示 */}
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => alert("KF 按鈕被點擊！")}
//                 >
//                     KF
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleWriteArea}
//                 >
//                     Writing Area
//                 </Button>
//             </div>
//         </Container>
//     );
// };

// export default KF;







// import { useNavigate } from "react-router-dom";
// import { Button, Container } from "@mui/material";
// import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect

// export const KF = () => {
//     const navigate = useNavigate();  // 使用 navigate 來進行路由導航
//     const role = localStorage.getItem("role") || "student";
//     const [userName, setUserName] = useState('');  // 用來儲存用戶姓名

//     // 跳轉到 Writing Area 頁面
//     const handleWriteArea = () => {
//         if (role === "teacher") {
//             // navigate("/teacher/home");  // 根據角色跳轉到不同頁面
//             navigate("/writing_area");  // 根據角色跳轉到不同頁面
//         } else {
//             // navigate("/home");
//             navigate("/writing_area");  // 根據角色跳轉到不同頁面
//         }
//     };

//     // 點擊 KF 按鈕時跳轉到 /kfweb 路徑
//     const handleKFClick = () => {
//         navigate("/kfweb");  // 跳轉到 /kfweb 頁面
//     };

//     useEffect(() => {
//         const name = localStorage.getItem('name');  // 從 localStorage 讀取姓名
//         if (name) {
//             setUserName(name);  // 設置姓名到 state
//         }
//     }, []);

//     return (
        
//         <Container 
//             style={{
//                 textAlign: "center", 
//                 position: "absolute",  // 使容器定位
//                 top: "50%",  // 垂直居中
//                 left: "50%",  // 水平居中
//                 transform: "translate(-50%, -50%)",  // 移動容器至正中間
//                 backgroundColor: "#FFEBCC", 
//                 padding: "20px", 
//                 width: "40%",  // 限制容器寬度
//                 borderRadius: "8px",  // 增加圓角效果
//             }}
//         >
//             {/* 新增容器包裹 Welcome 和 按鈕 */}
//             <div style={{ marginBottom: "20px" }}>
//                 <h1>Welcome to {userName ? userName : 'KF Interface'}</h1>  {/* 顯示姓名或默認文字 */}
//             </div>
            
//             {/* 包裹按鈕的容器，確保兩個按鈕在同一區塊內顯示 */}
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleKFClick}  // 點擊 KF 按鈕跳轉到 /kfweb
//                 >
//                     KF
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleWriteArea}
//                 >
//                     Writing Area
//                 </Button>
//             </div>
//         </Container>
//     );
// };

// export default KF;




// import { useNavigate } from "react-router-dom";
// import { Button, Container } from "@mui/material";
// import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect
// import Logo from "../assets/new_logo_1.png";
// import { HiOutlineBars3 } from 'react-icons/hi2';
// import { List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from "@mui/material"
// import { Box } from '@mui/system';
// import HomeIcon from "@mui/icons-material/Home";
// import InfoIcon from "@mui/icons-material/Info";
// import { Register } from './Register';
// import { Login } from './Login'



// export const KF = () => {
//     const navigate = useNavigate();  // 使用 navigate 來進行路由導航
//     const role = localStorage.getItem("role") || "student";
//     const [userName, setUserName] = useState('');  // 用來儲存用戶姓名
//     const [openMenu, setOpenMenu] = useState(false);

//     const menuOptions = [
//         {
//           text: "Home",
//           icon: <HomeIcon />,
//           onClick: () => navigate('/') // 跳轉到 Home 頁面
//         },
//         {
//           text: "About",
//           icon: <InfoIcon />,
//           onClick: () => navigate('/about') // 跳轉到 About 頁面
//         },
//         {
//           text: "Login",
//           icon: <Login />,
//           onClick: () => navigate('/login') // 跳轉到 Login 頁面
//         },
//         {
//           text: "Register",
//           icon: <Register />,
//           onClick: () => navigate('/register') // 跳轉到 Register 頁面
//         }
//       ];

//     // 跳轉到 Writing Area 頁面
//     const handleWriteArea = () => {
//         if (role === "teacher") {
//             // navigate("/teacher/home");  // 根據角色跳轉到不同頁面
//             navigate("/writing_area");  // 根據角色跳轉到不同頁面
//         } else {
//             // navigate("/home");
//             navigate("/writing_area");  // 根據角色跳轉到不同頁面
//         }
//     };

//     // 點擊 KF 按鈕時跳轉到 /kfweb 路徑
//     const handleKFClick = () => {
//         navigate("/kfweb");  // 跳轉到 /kfweb 頁面
//     };

//     useEffect(() => {
//         const name = localStorage.getItem('name');  // 從 localStorage 讀取姓名
//         if (name) {
//             setUserName(name);  // 設置姓名到 state
//         }
//     }, []);

//     return (
//         <nav>
//         <div className='nav-logo-container'>
//           <img alt='' src={Logo} width={150} height={120} />
//           <p style={{ marginLeft: '150px', position: 'relative', top: '-100px', fontSize: '28px' }}>
//             Collaborative Argumentation and Writing System
//           </p>
//         </div>
  
//         <div className="navbar-links-container">
//           <a href="" onClick={() => navigate('/')}>Home</a> {/* 使用 navigate 進行跳轉 */}
//           <a href="" onClick={() => navigate('/about')}>About</a> {/* 使用 navigate 進行跳轉 */}
//           <a href="" style={{ marginRight: '15px' }}>Manual</a>
//         </div>
  
//         <div className='navbar-menu-container'>
//           <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
//         </div>

//         <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
//         <Box
//           sx={{ width: 250 }}
//           role="presentation"
//           onClick={() => setOpenMenu(false)}
//           onKeyDown={() => setOpenMenu(false)}
//         >
//           <List>
//             {menuOptions.map((item) => (
//               <ListItem key={item.text} disablePadding>
//                 <ListItemButton onClick={item.onClick}> {/* 點擊時調用 onClick 進行導航 */}
//                   <ListItemIcon>{item.icon}</ListItemIcon>
//                   <ListItemText primary={item.text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//         </Box>
//       </Drawer>
// <br></br>
//       <div className="home-text-section">
//                     <h1 className="primary-heading">
//                         Inspire Thinking
//                         <br />
//                         Write Infinite Possibilities
//                     </h1>
                    
//                 </div>

//         <Container 
//             style={{
//                 textAlign: "center", 
//                 position: "absolute",  // 使容器定位
//                 top: "50%",  // 垂直居中
//                 left: "50%",  // 水平居中
//                 transform: "translate(-50%, -50%)",  // 移動容器至正中間
//                 backgroundColor: "#FFEBCC", 
//                 padding: "20px", 
//                 width: "40%",  // 限制容器寬度
//                 borderRadius: "8px",  // 增加圓角效果
//             }}
//         >
//             {/* 新增容器包裹 Welcome 和 按鈕 */}
//             <div style={{ marginBottom: "20px" }}>
//                 <h1>Welcome to {userName ? userName : 'KF Interface'}</h1>  {/* 顯示姓名或默認文字 */}
//             </div>
            
//             {/* 包裹按鈕的容器，確保兩個按鈕在同一區塊內顯示 */}
//             <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "20px" }}>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleKFClick}  // 點擊 KF 按鈕跳轉到 /kfweb
//                 >
//                     KF
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleWriteArea}
//                 >
//                     Writing Area
//                 </Button>
//             </div>
//         </Container>
//         </nav>
//     );
// };

// export default KF;









import { useNavigate } from "react-router-dom";
import { Button, Container } from "@mui/material";
import React, { useState, useEffect } from 'react';  // 確保導入 useState 和 useEffect
import Logo from "../assets/new_logo_1.png";
import { HiOutlineBars3 } from 'react-icons/hi2';
import { List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from "@mui/material"
import { Box } from '@mui/system';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { Register } from './Register';
import { Login } from './Login'
// import Navbar from "../components/HomePage_Navbar";
import Navbar from "../components/Navbar_Student";

export const KF = () => {
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
    const handleWriteArea = () => {
        if (role === "teacher") {
            // navigate("/teacher/home");  // 根據角色跳轉到不同頁面
            navigate("/writing_area");  // 根據角色跳轉到不同頁面
        } else {
            // navigate("/home");
            navigate("/home");  // 根據角色跳轉到不同頁面
        }
    };

    // 點擊 KF 按鈕時跳轉到 /kfweb 路徑
    const handleKFClick = () => {
        navigate("/kfweb_student");  // 跳轉到 /kfweb 頁面
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
                                <h1>Welcome to {userName ? userName : 'KF Interface'}</h1>  {/* 顯示姓名或默認文字 */}
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
                                    onClick={handleWriteArea}
                                >
                                    Writing Area
                                </Button>
                            </div>
                        </Container>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default KF;
