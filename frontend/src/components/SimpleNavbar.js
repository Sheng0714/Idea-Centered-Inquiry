// SimpleNavbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Toolbar, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { TutorialDialog } from './TutorialDialog';


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: '0px', // 设置AppBar高度

  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SimpleNavbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
 const handleTutorialOpen = () => {

    setTutorialOpen(true);

  };



  const handleTutorialClose = () => {

    setTutorialOpen(false);

  };
  return (
    <nav className="Snavbar">
      <AppBar position="fixed" open={open} style={{ background: 'transparent', boxShadow: 'none' }}>
      <Toolbar style={{ height: '10px' }}> {/* 设置Toolbar高度 */}

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon color="primary" style={{ color: '#8B8B8B', background: 'white', boxShadow: 'none' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="回首頁" arrow placement="right">
              <ListItemButton
                sx={{
                  minHeight: 60,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => navigate(-1)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    maxWidth: 24,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="回首頁" sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="使用說明" arrow placement="right">
              <ListItemButton
                sx={{
                  minHeight: 60,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={handleTutorialOpen}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    maxWidth: 24,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="使用說明" sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>
      <TutorialDialog open={tutorialOpen} onClose={handleTutorialClose} />
    </nav>
  );
}
