import React, { useState } from 'react';
import Logo from "../assets/LOGO-removebg-preview.png";
import { HiOutlineBars3 } from 'react-icons/hi2';
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LoginIcon from "@mui/icons-material/Login"; 
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 

import { List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Button } from "@mui/material"
import { Box } from '@mui/system';
import { Register } from './Register';
import { Login } from './Login'

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false)
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
    },
    {
      text: "About",
      icon: <InfoIcon />,
    },
    {
      text: "Login",
      icon: <LoginIcon />,
      action: () => {
        setOpenMenu(false); z
        setOpenLogin(true); 
      },
    },
    {
      text: "Register",
      icon: <PersonAddIcon />,
      action: () => {
        setOpenMenu(false); 
        setOpenRegister(true); 
      },
    },
  ];
  return (
    <nav>
       <div className='nav-logo-container'>
        <img alt='' src={Logo} width={150} height={120} />
        <p style={{ marginLeft: '150px', position: 'relative', top: '-75px', fontSize: '24px' }}>
          Collaborative Argumentation and Writing System
        </p>
      </div>
        
      <div className="navbar-links-container" style={{ marginLeft: "auto" }}>
        <a href='/..'>Home</a>
        <a href='/about'>About</a>
        {/* <button className='login-button' onClick={() => setOpenLogin(true)}>登入</button>
      <button className='register-button' onClick={() => setOpenRegister(true)}>註冊</button> */}

   </div>

      <div className='navbar-menu-container' style={{ marginLeft: "auto" }}>
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='right'>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuOptions.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={item.action}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Login open={openLogin} setOpen={setOpenLogin} setOpenRegister={setOpenRegister} />
      <Register open={openRegister} setOpen={setOpenRegister} setOpenLogin={setOpenLogin} />
     </nav>
  )
}