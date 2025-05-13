// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';


// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//     return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }
// const ITEM_HEIGHT = 48;



// export default function MyCreatedActivityCard({ activity }) {
//   const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(JSON.parse(localStorage.getItem('hiddenGroups') || '{}'));
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);

//   const open = Boolean(anchorEl);

//   // // 修改 createGroup 函數以接受數量參數
//   // const createGroup = async (num) => {
//   //   if (num < 1) {
//   //     alert("請輸入至少1個小組數量");
//   //     return;
//   //   }

//   //   try {
//   //     // 先獲取現有的小組數量
//   //     const response = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));

//   //     const existingGroups = response.data.Groups;
//   //     const nextGroupNumber = existingGroups.length + 1;

//   //     // 準備要創建的小組數據
//   //     const groupCreationPromises = [];
//   //     for (let i = 0; i < num; i++) {
//   //       const groupName = `第${nextGroupNumber + i}組`;
//   //       const groupData = {
//   //         groupName: groupName,
//   //         activityId: localStorage.getItem('activityId'),
//   //         numGroups: 1,
//   //       };

//   //       groupCreationPromises.push(
//   //         axios.post(url.backendHost + config[14].creatGroup, groupData)
//   //       );
//   //     }

//   //     // 同時發送所有創建小組的請求
//   //     const createGroupResponses = await Promise.all(groupCreationPromises);

//   //     // 發送 WebSocket 消息
//   //     sendMessage(ws);

//   //     // 讓當前用戶加入每個新創建的小組
//   //     const joinGroupPromises = createGroupResponses.map(response => {
//   //       const activityData = {
//   //         userId: localStorage.getItem('userId'),
//   //       };
//   //       return axios.put(
//   //         `${url.backendHost + config[5].joinActivity}/${response.data.groups[0].joinCode}/join`,
//   //         activityData
//   //       );
//   //     });

//   //     await Promise.all(joinGroupPromises);

//   //     alert(`${num} 個小組新增成功`);
//   //     setAnchorEl(null);
//   //     setExpanded(false);
//   //     getGroups(); // 更新小組列表
//   //     await axios.get(url.backendHost + config[1].reNewTokenUrl);

//   //   } catch (error) {
//   //     alert("新增小組失敗");
//   //     if (error.response) {
//   //       console.error("Server responded with error:", error.response);
//   //     } else if (error.request) {
//   //       console.error("Network error:", error.request);
//   //     } else {
//   //       console.error("Error:", error.message);
//   //     }
//   //   }
//   // };

  
//   const createGroup = async (num) => {
//     if (num < 1) {
//         alert("請輸入至少1個小組數量");
//         return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//         alert("活動 ID 無效，請重新選擇活動！");
//         return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//         console.log('開始創建小組，數量:', num, '活動 ID:', activityId);

//         // 創建小組
//         const groupCreationPromises = [];
//         for (let i = 0; i < num; i++) {
//             const groupName = `第${i + 1}組`;
//             const groupData = { groupName, activityId, numGroups: 1 };
//             console.log('創建小組:', groupData);
//             groupCreationPromises.push(
//                 axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//             );
//         }
//         const responses = await Promise.all(groupCreationPromises);
//         const newGroups = responses.flatMap(res => res.data.groups || []);
//         console.log('新創建的小組:', newGroups);

//         // 加入小組
//         const userId = localStorage.getItem('userId');
//         const joinGroupPromises = newGroups.map(group => {
//             const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//             console.log('加入小組 URL:', joinUrl);
//             return axios.put(joinUrl, { userId });
//         });
//         await Promise.all(joinGroupPromises);
//         console.log('加入小組成功');

//         // 更新前端
//         sendMessage(ws);
//         alert(`${num} 個小組新增成功`);
//         setAnchorEl(null);
//         setExpanded(false);

//         // 獲取活動資訊並更新
//         const activityUrl = `${baseUrl}/api/activities/${activityId}`;
//         console.log('獲取活動 URL:', activityUrl);
//         const activityResponse = await axios.get(activityUrl);
//         console.log('活動資料:', activityResponse.data);
//         const sortedGroups = activityResponse.data.groups.sort((a, b) => a.id - b.id);
//         setGroupData(sortedGroups);
//         console.log('groupData 已更新:', sortedGroups);

//         // 刷新 Token
//         await axios.get(`${baseUrl}/${config[1].reNewTokenUrl}`);
//     } catch (error) {
//         console.error("新增小組失敗詳情:", {
//             status: error.response?.status,
//             data: error.response?.data,
//             message: error.message,
//             url: error.config?.url
//         });
//         if (error.response?.status === 404) {
//             alert(`新增小組失敗：活動不存在或路徑錯誤！失敗請求: ${error.config?.url}`);
//         } else if (error.response?.status === 403) {
//             alert("新增小組失敗：權限不足！");
//         } else {
//             alert("新增小組失敗，請稍後再試！");
//         }
//     }
// };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data=='') {
//         // if no settings, new a activity info for this activity
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
        
//       }else{
        
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });

//   };

//   const options = [
//     { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '新增小組', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//     //{ text: '課堂任務', modalKey: '', icon:  },
//     //{ text: '學生分組', modalKey: 'activityGrouping', icon: ActivityGroupingIcon },
//     //{ text: '編輯活動資訊', modalKey: 'editInformationOfActivity', icon: EditIcon },
//     //{ text: '刪除', modalKey: 'deleteActivity', icon: TrashIcon },

//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId'); // 清空 groupId
//       }

//       // 同時將localStorage資料全部傳給sessionStorage
//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

  

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };
//   const getActivityInfo= async () => await axios.get(url.backendHost +'api/activityInfo/' + localStorage.getItem('activityId')).then((response) => {
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response
//     });
  
//   const postActivityInfo= async () => await axios.post(url.backendHost +'api/activityInfo/',{
//       activityId: localStorage.getItem('activityId'),
//       userId: localStorage.getItem('userId'),
//     }).then((response) => {
//       console.log("postActivityInfo", response);
//       return response
//     });
//   const putActivityInfo = async (roomSetting) => {
//     try {
//       await axios.put(url.backendHost +'api/activityInfo/'+ localStorage.getItem('activityId'),{
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       }).then((response) => {
//         console.log("putActivityInfo", response);
//         return response
//       });
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   }

  

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
//     initWebSocket(ws);

//     return () => {
//       ws.disconnect();
//     };
//   }, []);

//   // const getGroups = async () => {
//   //   try {
//   //     const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));
//   //     // console.log("GroupData: ", fetchData.data.Groups);
//   //     const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//   //     setGroupData(sortedGroups);
//   //   } catch (err) {
//   //     // console.log(err);
//   //   }
//   // };

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//         const activityUrl = `${baseUrl}/api/activities/${activityId}`;
//         console.log('獲取活動 URL:', activityUrl);
//         const fetchData = await axios.get(activityUrl);
//         console.log('活動資料:', fetchData.data);
//         const sortedGroups = fetchData.data.groups.sort((a, b) => a.id - b.id);
//         setGroupData(sortedGroups);
//         console.log('groupData 已更新:', sortedGroups);
//         return sortedGroups;
//     } catch (err) {
//         console.error("獲取小組失敗詳情:", {
//             status: err.response?.status,
//             data: err.response?.data,
//             message: err.message,
//             url: err.config?.url
//         });
//         throw err;
//     }
// };
  

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       //   second: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };


//   const handleEnter = async (e) => {

//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//       // console.log("groupData:response ", response.data.data[0].id);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//           console.log("getActivityInfo", activityInfo);
//           window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//           console.error(error);
//           window.open("/forum", '_blank');
//       });
    
//   };
//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };
//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => { 
//                     if (option.modalKey) {
//                       openModal(option.modalKey); 
//                     }
//                     if (option.onClick) {
//                       option.onClick(); 
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開小組列表 ▼ 
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 小組列表
//                 <Button className='hidden-button' onClick={showAllHiddenGroups}>
//                   顯示所有隱藏小組
//                 </Button>
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button 
//                         className='enter-activity-button' 
//                         onClick={(e) => { 
//                           localStorage.setItem('groupId', group.id); 
//                           localStorage.setItem('joinCode', group.joinCode); 
//                           handleEnter(e); 
//                         }}>
//                         進入小組
//                       </Button>
//                       <Button 
//                         className='hidden-button' 
//                         onClick={() => toggleGroupVisibility(group.id)} 
//                         style={{ background: '#e3dffd', fontSize:"24px" }}>
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText primary={group.groupName} secondary={"小組邀請碼：" + group.joinCode} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增小組</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text" 
//             color="primary"  
//             >
//               取消
//             </MuiButton>
//           <MuiButton 
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1); 
//             }}
//             disabled={creatingGroups}
//             variant="text" 
//             color="primary"  
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//       {/* {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )}
//         {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )} */}
//     </div>
//   );
// }






//有新增小組成功但重整就會消失
// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';


// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//     return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }
// const ITEM_HEIGHT = 48;



// export default function MyCreatedActivityCard({ activity }) {
//   const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(JSON.parse(localStorage.getItem('hiddenGroups') || '{}'));
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);

//   const open = Boolean(anchorEl);

//   // // 修改 createGroup 函數以接受數量參數
//   // const createGroup = async (num) => {
//   //   if (num < 1) {
//   //     alert("請輸入至少1個小組數量");
//   //     return;
//   //   }

//   //   try {
//   //     // 先獲取現有的小組數量
//   //     const response = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));

//   //     const existingGroups = response.data.Groups;
//   //     const nextGroupNumber = existingGroups.length + 1;

//   //     // 準備要創建的小組數據
//   //     const groupCreationPromises = [];
//   //     for (let i = 0; i < num; i++) {
//   //       const groupName = `第${nextGroupNumber + i}組`;
//   //       const groupData = {
//   //         groupName: groupName,
//   //         activityId: localStorage.getItem('activityId'),
//   //         numGroups: 1,
//   //       };

//   //       groupCreationPromises.push(
//   //         axios.post(url.backendHost + config[14].creatGroup, groupData)
//   //       );
//   //     }

//   //     // 同時發送所有創建小組的請求
//   //     const createGroupResponses = await Promise.all(groupCreationPromises);

//   //     // 發送 WebSocket 消息
//   //     sendMessage(ws);

//   //     // 讓當前用戶加入每個新創建的小組
//   //     const joinGroupPromises = createGroupResponses.map(response => {
//   //       const activityData = {
//   //         userId: localStorage.getItem('userId'),
//   //       };
//   //       return axios.put(
//   //         `${url.backendHost + config[5].joinActivity}/${response.data.groups[0].joinCode}/join`,
//   //         activityData
//   //       );
//   //     });

//   //     await Promise.all(joinGroupPromises);

//   //     alert(`${num} 個小組新增成功`);
//   //     setAnchorEl(null);
//   //     setExpanded(false);
//   //     getGroups(); // 更新小組列表
//   //     await axios.get(url.backendHost + config[1].reNewTokenUrl);

//   //   } catch (error) {
//   //     alert("新增小組失敗");
//   //     if (error.response) {
//   //       console.error("Server responded with error:", error.response);
//   //     } else if (error.request) {
//   //       console.error("Network error:", error.request);
//   //     } else {
//   //       console.error("Error:", error.message);
//   //     }
//   //   }
//   // };

  
//   const createGroup = async (num) => {
//     if (num < 1) {
//       alert("請輸入至少1個小組數量");
//       return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
  
//     let newGroups = []; // 用於儲存新創建的小組
  
//     try {
//       console.log('開始創建小組，數量:', num, '活動 ID:', activityId);
  
//       // 先獲取現有小組數量
//       const response = await axios.get(`${baseUrl}/${config[15].findAllGroup}${activityId}`);
//       const existingGroups = response.data.Groups || [];
//       const nextGroupNumber = existingGroups.length + 1;
  
//       // 創建小組
//       const groupCreationPromises = [];
//       for (let i = 0; i < num; i++) {
//         const groupName = `第${nextGroupNumber + i}組`;
//         const groupData = { groupName, activityId, numGroups: 1 };
//         console.log('創建小組:', groupData);
//         groupCreationPromises.push(
//           axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//         );
//       }
//       const responses = await Promise.all(groupCreationPromises);
//       newGroups = responses.flatMap(res => res.data.groups || []);
//       console.log('新創建的小組:', newGroups);
  
//       // 加入小組
//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');
  
//       // 更新前端
//       sendMessage(ws);
//       alert(`${num} 個小組新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);
  
//       // 嘗試獲取最新資料，若失敗則手動更新
//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，假設創建成功並手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]); // 手動添加新小組
//       }
  
//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         // 如果小組已創建成功但後續失敗，仍更新本地狀態
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("小組已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增小組失敗，請稍後再試！");
//       }
//       return;
//     }
  
//     // 獨立處理 renew 請求
//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data=='') {
//         // if no settings, new a activity info for this activity
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
        
//       }else{
        
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });

//   };

//   const options = [
//     { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '新增小組', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//     //{ text: '課堂任務', modalKey: '', icon:  },
//     //{ text: '學生分組', modalKey: 'activityGrouping', icon: ActivityGroupingIcon },
//     //{ text: '編輯活動資訊', modalKey: 'editInformationOfActivity', icon: EditIcon },
//     //{ text: '刪除', modalKey: 'deleteActivity', icon: TrashIcon },

//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId'); // 清空 groupId
//       }

//       // 同時將localStorage資料全部傳給sessionStorage
//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

  

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };
//   const getActivityInfo= async () => await axios.get(url.backendHost +'api/activityInfo/' + localStorage.getItem('activityId')).then((response) => {
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response
//     });
  
//   const postActivityInfo= async () => await axios.post(url.backendHost +'api/activityInfo/',{
//       activityId: localStorage.getItem('activityId'),
//       userId: localStorage.getItem('userId'),
//     }).then((response) => {
//       console.log("postActivityInfo", response);
//       return response
//     });
//   const putActivityInfo = async (roomSetting) => {
//     try {
//       await axios.put(url.backendHost +'api/activityInfo/'+ localStorage.getItem('activityId'),{
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       }).then((response) => {
//         console.log("putActivityInfo", response);
//         return response
//       });
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   }

  

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
//     initWebSocket(ws);

//     return () => {
//       ws.disconnect();
//     };
//   }, []);

//   // const getGroups = async () => {
//   //   try {
//   //     const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));
//   //     // console.log("GroupData: ", fetchData.data.Groups);
//   //     const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//   //     setGroupData(sortedGroups);
//   //   } catch (err) {
//   //     // console.log(err);
//   //   }
//   // };

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/api/activities/${activityId}`; // 與您的 API 保持一致
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.groups.sort((a, b) => a.id - b.id); // 確認這裡的 'groups' 正確
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };
  

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       //   second: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };


//   const handleEnter = async (e) => {

//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//       // console.log("groupData:response ", response.data.data[0].id);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//           console.log("getActivityInfo", activityInfo);
//           window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//           console.error(error);
//           window.open("/forum", '_blank');
//       });
    
//   };
//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };
//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => { 
//                     if (option.modalKey) {
//                       openModal(option.modalKey); 
//                     }
//                     if (option.onClick) {
//                       option.onClick(); 
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開小組列表 ▼ 
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 小組列表
//                 <Button className='hidden-button' onClick={showAllHiddenGroups}>
//                   顯示所有隱藏小組
//                 </Button>
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button 
//                         className='enter-activity-button' 
//                         onClick={(e) => { 
//                           localStorage.setItem('groupId', group.id); 
//                           localStorage.setItem('joinCode', group.joinCode); 
//                           handleEnter(e); 
//                         }}>
//                         進入小組
//                       </Button>
//                       <Button 
//                         className='hidden-button' 
//                         onClick={() => toggleGroupVisibility(group.id)} 
//                         style={{ background: '#e3dffd', fontSize:"24px" }}>
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText primary={group.groupName} secondary={"小組邀請碼：" + group.joinCode} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增小組</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text" 
//             color="primary"  
//             >
//               取消
//             </MuiButton>
//           <MuiButton 
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1); 
//             }}
//             disabled={creatingGroups}
//             variant="text" 
//             color="primary"  
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//       {/* {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )}
//         {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )} */}
//     </div>
//   );
// }









// //三版
// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';


// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//     return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }
// const ITEM_HEIGHT = 48;



// export default function MyCreatedActivityCard({ activity }) {
//   const ws = io.connect(url.socketioHost,{path: '/s/socket.io'});
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(JSON.parse(localStorage.getItem('hiddenGroups') || '{}'));
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);

//   const open = Boolean(anchorEl);

//   // // 修改 createGroup 函數以接受數量參數
//   // const createGroup = async (num) => {
//   //   if (num < 1) {
//   //     alert("請輸入至少1個小組數量");
//   //     return;
//   //   }

//   //   try {
//   //     // 先獲取現有的小組數量
//   //     const response = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));

//   //     const existingGroups = response.data.Groups;
//   //     const nextGroupNumber = existingGroups.length + 1;

//   //     // 準備要創建的小組數據
//   //     const groupCreationPromises = [];
//   //     for (let i = 0; i < num; i++) {
//   //       const groupName = `第${nextGroupNumber + i}組`;
//   //       const groupData = {
//   //         groupName: groupName,
//   //         activityId: localStorage.getItem('activityId'),
//   //         numGroups: 1,
//   //       };

//   //       groupCreationPromises.push(
//   //         axios.post(url.backendHost + config[14].creatGroup, groupData)
//   //       );
//   //     }

//   //     // 同時發送所有創建小組的請求
//   //     const createGroupResponses = await Promise.all(groupCreationPromises);

//   //     // 發送 WebSocket 消息
//   //     sendMessage(ws);

//   //     // 讓當前用戶加入每個新創建的小組
//   //     const joinGroupPromises = createGroupResponses.map(response => {
//   //       const activityData = {
//   //         userId: localStorage.getItem('userId'),
//   //       };
//   //       return axios.put(
//   //         `${url.backendHost + config[5].joinActivity}/${response.data.groups[0].joinCode}/join`,
//   //         activityData
//   //       );
//   //     });

//   //     await Promise.all(joinGroupPromises);

//   //     alert(`${num} 個小組新增成功`);
//   //     setAnchorEl(null);
//   //     setExpanded(false);
//   //     getGroups(); // 更新小組列表
//   //     await axios.get(url.backendHost + config[1].reNewTokenUrl);

//   //   } catch (error) {
//   //     alert("新增小組失敗");
//   //     if (error.response) {
//   //       console.error("Server responded with error:", error.response);
//   //     } else if (error.request) {
//   //       console.error("Network error:", error.request);
//   //     } else {
//   //       console.error("Error:", error.message);
//   //     }
//   //   }
//   // };

  
//   const createGroup = async (num) => {
//     if (num < 1) {
//       alert("請輸入至少1個小組數量");
//       return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
  
//     let newGroups = [];
  
//     try {
//       console.log('開始創建小組，數量:', num, '活動 ID:', activityId);
  
//       // 先獲取現有小組數量
//       const response = await axios.get(`${baseUrl}/${config[15].findAllGroup}${activityId}`);
//       const existingGroups = response.data.Groups || [];
//       const nextGroupNumber = existingGroups.length + 1;
  
//       // 創建小組
//       const groupCreationPromises = [];
//       for (let i = 0; i < num; i++) {
//         const groupName = `第${nextGroupNumber + i}組`;
//         const groupData = { groupName, activityId, numGroups: 1 };
//         console.log('創建小組:', groupData);
//         groupCreationPromises.push(
//           axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//         );
//       }
//       const responses = await Promise.all(groupCreationPromises);
//       newGroups = responses.flatMap(res => res.data.groups || []);
//       console.log('新創建的小組:', newGroups);
  
//       // 加入小組
//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');
  
//       // 更新前端
//       sendMessage(ws);
//       alert(`${num} 個小組新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);
  
//       // 驗證並更新資料
//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]);
//       }
  
//       // 檢查後端是否包含新小組
//       const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
//       console.log('驗證後端資料:', verifyResponse.data);
  
//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("主題已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增主題失敗，請稍後再試！");
//       }
//       return;
//     }
  
//     // 獨立處理 renew 請求
//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data=='') {
//         // if no settings, new a activity info for this activity
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
        
//       }else{
        
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });

//   };

//   const options = [
//     { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//     //{ text: '課堂任務', modalKey: '', icon:  },
//     //{ text: '學生分組', modalKey: 'activityGrouping', icon: ActivityGroupingIcon },
//     //{ text: '編輯活動資訊', modalKey: 'editInformationOfActivity', icon: EditIcon },
//     //{ text: '刪除', modalKey: 'deleteActivity', icon: TrashIcon },

//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId'); // 清空 groupId
//       }

//       // 同時將localStorage資料全部傳給sessionStorage
//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

  

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };
//   const getActivityInfo= async () => await axios.get(url.backendHost +'api/activityInfo/' + localStorage.getItem('activityId')).then((response) => {
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response
//     });
  
//   const postActivityInfo= async () => await axios.post(url.backendHost +'api/activityInfo/',{
//       activityId: localStorage.getItem('activityId'),
//       userId: localStorage.getItem('userId'),
//     }).then((response) => {
//       console.log("postActivityInfo", response);
//       return response
//     });
//   const putActivityInfo = async (roomSetting) => {
//     try {
//       await axios.put(url.backendHost +'api/activityInfo/'+ localStorage.getItem('activityId'),{
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       }).then((response) => {
//         console.log("putActivityInfo", response);
//         return response
//       });
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   }

  

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//     initWebSocket(ws);
  
//     // 初始化時獲取小組資料
//     if (activity.id) {
//       localStorage.setItem('activityId', activity.id);
//       getGroups();
//     }
  
//     return () => {
//       ws.disconnect();
//     };
//   }, [activity.id]);

//   // const getGroups = async () => {
//   //   try {
//   //     const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + localStorage.getItem('activityId'));
//   //     // console.log("GroupData: ", fetchData.data.Groups);
//   //     const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//   //     setGroupData(sortedGroups);
//   //   } catch (err) {
//   //     // console.log(err);
//   //   }
//   // };

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`; // 修改為對方的 API
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id); // 注意這裡是 Groups 而非 groups
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };
  

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       //   second: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };


//   const handleEnter = async (e) => {

//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//       // console.log("groupData:response ", response.data.data[0].id);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//           console.log("getActivityInfo", activityInfo);
//           window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//           console.error(error);
//           window.open("/forum", '_blank');
//       });
    
//   };
//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };
//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => { 
//                     if (option.modalKey) {
//                       openModal(option.modalKey); 
//                     }
//                     if (option.onClick) {
//                       option.onClick(); 
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開主題列表 ▼ 
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 主題列表
//                 <Button className='hidden-button' onClick={showAllHiddenGroups}>
//                   顯示所有隱藏主題
//                 </Button>
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button 
//                         className='enter-activity-button' 
//                         onClick={(e) => { 
//                           localStorage.setItem('groupId', group.id); 
//                           localStorage.setItem('joinCode', group.joinCode); 
//                           handleEnter(e); 
//                         }}>
//                         進入名單
//                       </Button>
//                       <Button 
//                         className='hidden-button' 
//                         onClick={() => toggleGroupVisibility(group.id)} 
//                         style={{ background: '#e3dffd', fontSize:"24px" }}>
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText primary={group.groupName} secondary={"小組邀請碼：" + group.joinCode} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text" 
//             color="primary"  
//             >
//               取消
//             </MuiButton>
//           <MuiButton 
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1); 
//             }}
//             disabled={creatingGroups}
//             variant="text" 
//             color="primary"  
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//       {/* {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )}
//         {selectedModal === 'editInformationOfActivity' && (
//             <CreateIdea
//                 open={openModal}
//                 onClose={closeModal}
//             />
//         )} */}
//     </div>
//   );
// }




// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';

// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//       return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }

// const ITEM_HEIGHT = 48;

// export default function MyCreatedActivityCard({ activity }) {
//   const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(JSON.parse(localStorage.getItem('hiddenGroups') || '{}'));
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);
//   const [openHideDialog, setOpenHideDialog] = useState(false); // 控制隱藏確認視窗
//   const [groupToHide, setGroupToHide] = useState(null); // 儲存待隱藏的主題

//   const open = Boolean(anchorEl);

//   const createGroup = async (num) => {
//     if (num < 1) {
//       alert("請輸入至少1個小組數量");
//       return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;

//     let newGroups = [];

//     try {
//       console.log('開始創建小組，數量:', num, '活動 ID:', activityId);

//       // 先獲取現有小組數量
//       const response = await axios.get(`${baseUrl}/${config[15].findAllGroup}${activityId}`);
//       const existingGroups = response.data.Groups || [];
//       const nextGroupNumber = existingGroups.length + 1;

//       // 創建小組
//       const groupCreationPromises = [];
//       for (let i = 0; i < num; i++) {
//         const groupName = `第${nextGroupNumber + i}組`;
//         const groupData = { groupName, activityId, numGroups: 1 };
//         console.log('創建小組:', groupData);
//         groupCreationPromises.push(
//           axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//         );
//       }
//       const responses = await Promise.all(groupCreationPromises);
//       newGroups = responses.flatMap(res => res.data.groups || []);
//       console.log('新創建的小組:', newGroups);

//       // 加入小組
//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');

//       // 更新前端
//       sendMessage(ws);
//       alert(`${num} 個小組新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);

//       // 驗證並更新資料
//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]);
//       }

//       // 檢查後端是否包含新小組
//       const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
//       console.log('驗證後端資料:', verifyResponse.data);

//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("主題已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增主題失敗，請稍後再試！");
//       }
//       return;
//     }

//     // 獨立處理 renew 請求
//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data == '') {
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
//       } else {
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });
//   };

//   const options = [
//     { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId');
//       }

//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };

//   const getActivityInfo = async () => await axios.get(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId')).then((response) => {
//     localStorage.setItem('activityInfo', JSON.stringify(response.data));
//     console.log("getActivityInfo", response);
//     return response;
//   });

//   const postActivityInfo = async () => await axios.post(url.backendHost + 'api/activityInfo/', {
//     activityId: localStorage.getItem('activityId'),
//     userId: localStorage.getItem('userId'),
//   }).then((response) => {
//     console.log("postActivityInfo", response);
//     return response;
//   });

//   const putActivityInfo = async (roomSetting) => {
//     try {
//       await axios.put(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'), {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       }).then((response) => {
//         console.log("putActivityInfo", response);
//         return response;
//       });
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//     initWebSocket(ws);

//     if (activity.id) {
//       localStorage.setItem('activityId', activity.id);
//       getGroups();
//     }

//     return () => {
//       ws.disconnect();
//     };
//   }, [activity.id]);

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`;
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };

//   const handleEnter = async (e) => {
//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//         console.log("getActivityInfo", activityInfo);
//         window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//         console.error(error);
//         window.open("/forum", '_blank');
//       });
//   };

//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   // 打開隱藏確認視窗
//   const handleOpenHideDialog = (group) => {
//     setGroupToHide(group);
//     setOpenHideDialog(true);
//   };

//   // 關閉隱藏確認視窗
//   const handleCloseHideDialog = () => {
//     setGroupToHide(null);
//     setOpenHideDialog(false);
//   };

//   // 執行隱藏操作
//   const handleHideGroup = () => {
//     if (!groupToHide) return;
//     toggleGroupVisibility(groupToHide.id);
//     handleCloseHideDialog();
//   };

//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => {
//                     if (option.modalKey) {
//                       openModal(option.modalKey);
//                     }
//                     if (option.onClick) {
//                       option.onClick();
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開主題列表 ▼
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 主題列表
//                 {/* <Button className='hidden-button' onClick={showAllHiddenGroups}>
//                   顯示所有隱藏主題
//                 </Button> */}
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button
//                         className='enter-activity-button'
//                         onClick={(e) => {
//                           localStorage.setItem('groupId', group.id);
//                           localStorage.setItem('joinCode', group.joinCode);
//                           handleEnter(e);
//                         }}
//                       >
//                         進入名單
//                       </Button>
//                       <Button
//                         className='hidden-button'
//                         onClick={() => handleOpenHideDialog(group)} // 改為打開隱藏確認視窗
//                         style={{ background: '#e3dffd', fontSize: "24px" }}
//                       >
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText primary={group.groupName} secondary={"小組邀請碼：" + group.joinCode} />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text"
//             color="primary"
//           >
//             取消
//           </MuiButton>
//           <MuiButton
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1);
//             }}
//             disabled={creatingGroups}
//             variant="text"
//             color="primary"
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 隱藏確認對話框 */}
//       <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
//         <DialogTitle>刪除主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             是否要刪除此主題「{groupToHide?.groupName}」？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseHideDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleHideGroup} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//     </div>
//   );
// }

// //四版
// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';

// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
//   width: '300px', // 固定寬度
//   minHeight: '200px', // 最小高度
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//       return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }

// const ITEM_HEIGHT = 48;

// export default function MyCreatedActivityCard({ activity, onDelete }) {
//   const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenGroups');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenGroups 失敗:", error);
//       return {};
//     }
//   });
//   const [hiddenActivities, setHiddenActivities] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenActivities');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenActivities 失敗:", error);
//       return {};
//     }
//   });
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);
//   const [openHideDialog, setOpenHideDialog] = useState(false);
//   const [groupToHide, setGroupToHide] = useState(null);
//   const [openRenameDialog, setOpenRenameDialog] = useState(false);
//   const [newClassName, setNewClassName] = useState(activity.title);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   const open = Boolean(anchorEl);

//   const createGroup = async (num) => {
//     if (num < 1) {
//       alert("請輸入至少1個小組數量");
//       return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;

//     let newGroups = [];

//     try {
//       console.log('開始創建小組，數量:', num, '活動 ID:', activityId);

//       const response = await axios.get(`${baseUrl}/${config[15].findAllGroup}${activityId}`);
//       const existingGroups = response.data.Groups || [];
//       const nextGroupNumber = existingGroups.length + 1;

//       const groupCreationPromises = [];
//       for (let i = 0; i < num; i++) {
//         const groupName = `第${nextGroupNumber + i}組`;
//         const groupData = { groupName, activityId, numGroups: 1 };
//         console.log('創建小組:', groupData);
//         groupCreationPromises.push(
//           axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//         );
//       }
//       const responses = await Promise.all(groupCreationPromises);
//       newGroups = responses.flatMap(res => res.data.groups || []);
//       console.log('新創建的小組:', newGroups);

//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');

//       sendMessage(ws);
//       alert(`${num} 個小組新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);

//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]);
//       }

//       const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
//       console.log('驗證後端資料:', verifyResponse.data);

//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("主題已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增主題失敗，請稍後再試！");
//       }
//       return;
//     }

//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data == '') {
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
//       } else {
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });
//   };

//   const options = [
//     // { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '修改班級名稱', onClick: () => setOpenRenameDialog(true), icon: EditIcon },
//     { text: '刪除班級', onClick: () => setOpenDeleteDialog(true), icon: TrashIcon },
//     { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     // { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     // { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId');
//       }

//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };

//   const getActivityInfo = async () => {
//     try {
//       const response = await axios.get(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'));
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("獲取活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const postActivityInfo = async () => {
//     try {
//       const response = await axios.post(url.backendHost + 'api/activityInfo/', {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//       });
//       console.log("postActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("發送活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const putActivityInfo = async (roomSetting) => {
//     try {
//       const response = await axios.put(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'), {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       });
//       console.log("putActivityInfo", response);
//       return response;
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//     initWebSocket(ws);

//     if (activity.id) {
//       localStorage.setItem('activityId', activity.id);
//       getGroups();
//     }

//     return () => {
//       ws.disconnect();
//     };
//   }, [activity.id]);

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`;
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };

//   const handleEnter = async (e) => {
//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//         console.log("getActivityInfo", activityInfo);
//         window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//         console.error(error);
//         window.open("/forum", '_blank');
//       });
//   };

//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const toggleActivityVisibility = (activityId) => {
//     const updatedHiddenActivities = { ...hiddenActivities, [activityId]: true };
//     setHiddenActivities(updatedHiddenActivities);
//     localStorage.setItem('hiddenActivities', JSON.stringify(updatedHiddenActivities));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const handleOpenHideDialog = (group) => {
//     setGroupToHide(group);
//     setOpenHideDialog(true);
//   };

//   const handleCloseHideDialog = () => {
//     setGroupToHide(null);
//     setOpenHideDialog(false);
//   };

//   const handleHideGroup = () => {
//     if (!groupToHide) return;
//     toggleGroupVisibility(groupToHide.id);
//     handleCloseHideDialog();
//   };

//   const handleOpenRenameDialog = () => {
//     setNewClassName(activity.title);
//     setOpenRenameDialog(true);
//   };

//   const handleCloseRenameDialog = () => {
//     setOpenRenameDialog(false);
//     setNewClassName(activity.title);
//   };

//   const handleRenameClass = async () => {
//     if (!newClassName.trim()) {
//       alert("班級名稱不能為空！");
//       return;
//     }

//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       await axios.put(`${baseUrl}/api/activities/${activity.id}`, {
//         title: newClassName,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//       });

//       activity.title = newClassName;
//       alert("班級名稱修改成功！");
//       sendMessage(ws);
//     } catch (error) {
//       console.error("修改班級名稱失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url,
//       });
//       alert("修改班級名稱失敗，請稍後再試！");
//     } finally {
//       handleCloseRenameDialog();
//     }
//   };

//   const handleOpenDeleteDialog = () => {
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleDeleteClass = () => {
//     console.log("正在刪除班級:", activity.id);
//     // 將班級標記為隱藏
//     toggleActivityVisibility(activity.id);

//     // 通知父組件移除該班級（從顯示列表中移除）
//     if (onDelete) {
//       console.log("調用 onDelete，移除班級:", activity.id);
//       onDelete(activity.id);
//     }

//     alert("班級已刪除！");
//     handleCloseDeleteDialog();
//   };

//   // 如果班級被隱藏，則不渲染該組件
//   if (hiddenActivities[activity.id]) {
//     console.log("班級被隱藏，不渲染:", activity.id);
//     return null;
//   }

//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => {
//                     if (option.modalKey) {
//                       openModal(option.modalKey);
//                     }
//                     if (option.onClick) {
//                       option.onClick();
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開主題列表 ▼
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 主題列表
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button
//                         className='enter-activity-button'
//                         onClick={(e) => {
//                           localStorage.setItem('groupId', group.id);
//                           localStorage.setItem('joinCode', group.joinCode);
//                           handleEnter(e);
//                         }}
//                       >
//                         進入名單
//                       </Button>
//                       <Button
//                         className='hidden-button'
//                         onClick={() => handleOpenHideDialog(group)}
//                         style={{ background: '#e3dffd', fontSize: "24px" }}
//                       >
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                   <ListItemText
//                   primary={group.groupName}
//                   secondary={"小組邀請碼：\n" + group.joinCode}
//                   secondaryTypographyProps={{
//                   style: {
//                           whiteSpace: 'pre-wrap', // 允許換行，識別 \n
//                           },
//               }}
//             />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text"
//             color="primary"
//           >
//             取消
//           </MuiButton>
//           <MuiButton
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1);
//             }}
//             disabled={creatingGroups}
//             variant="text"
//             color="primary"
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 隱藏確認對話框 */}
//       <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
//         <DialogTitle>刪除主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             是否要刪除此主題「{groupToHide?.groupName}」？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseHideDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleHideGroup} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 修改班級名稱對話框 */}
//       <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog}>
//         <DialogTitle>修改班級名稱</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入新的班級名稱：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="className"
//             label="班級名稱"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newClassName}
//             onChange={(e) => setNewClassName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseRenameDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleRenameClass} variant="text" color="primary">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 刪除班級確認對話框 */}
//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
//         <DialogTitle>刪除班級</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要刪除此班級「{activity.title}」？連同班級內的主題也會一併刪除。
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseDeleteDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleDeleteClass} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//     </div>
//   );
// }










// //五版
// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';

// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
//   width: '300px', // 固定寬度
//   minHeight: '200px', // 最小高度
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//       return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }

// const ITEM_HEIGHT = 48;

// export default function MyCreatedActivityCard({ activity, onDelete }) {
//   const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenGroups');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenGroups 失敗:", error);
//       return {};
//     }
//   });
//   const [hiddenActivities, setHiddenActivities] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenActivities');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenActivities 失敗:", error);
//       return {};
//     }
//   });
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [numGroupsToCreate, setNumGroupsToCreate] = useState(1);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);
//   const [openHideDialog, setOpenHideDialog] = useState(false);
//   const [groupToHide, setGroupToHide] = useState(null);
//   const [openRenameDialog, setOpenRenameDialog] = useState(false);
//   const [newClassName, setNewClassName] = useState(activity.title);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   const open = Boolean(anchorEl);

//   const createGroup = async (num) => {
//     if (num < 1) {
//       alert("請輸入至少1個小組數量");
//       return;
//     }
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;

//     let newGroups = [];

//     try {
//       console.log('開始創建小組，數量:', num, '活動 ID:', activityId);

//       const response = await axios.get(`${baseUrl}/${config[15].findAllGroup}${activityId}`);
//       const existingGroups = response.data.Groups || [];
//       const nextGroupNumber = existingGroups.length + 1;

//       const groupCreationPromises = [];
//       for (let i = 0; i < num; i++) {
//         const groupName = `第${nextGroupNumber + i}組`;
//         const groupData = { groupName, activityId, numGroups: 1 };
//         console.log('創建小組:', groupData);
//         groupCreationPromises.push(
//           axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData)
//         );
//       }
//       const responses = await Promise.all(groupCreationPromises);
//       newGroups = responses.flatMap(res => res.data.groups || []);
//       console.log('新創建的小組:', newGroups);

//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');

//       sendMessage(ws);
//       alert(`${num} 個小組新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);

//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]);
//       }

//       const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
//       console.log('驗證後端資料:', verifyResponse.data);

//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("主題已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增主題失敗，請稍後再試！");
//       }
//       return;
//     }

//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data == '') {
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
//       } else {
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });
//   };

//   const options = [
//     // { text: '派發活動任務', modalKey: 'enterPageOfPrepareLesson', icon: EditIcon },
//     { text: '修改班級名稱', onClick: () => setOpenRenameDialog(true), icon: EditIcon },
//     { text: '刪除班級', onClick: () => setOpenDeleteDialog(true), icon: TrashIcon },
//     { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//     // { text: '設定活動聊天室', onClick: editClassSetting, icon: EditIcon },
//     // { text: '儀表板分析', onClick: () => navigate('/dashboard'), icon: AssignmentIcon },
//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId');
//       }

//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };

//   const getActivityInfo = async () => {
//     try {
//       const response = await axios.get(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'));
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("獲取活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const postActivityInfo = async () => {
//     try {
//       const response = await axios.post(url.backendHost + 'api/activityInfo/', {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//       });
//       console.log("postActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("發送活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const putActivityInfo = async (roomSetting) => {
//     try {
//       const response = await axios.put(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'), {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       });
//       console.log("putActivityInfo", response);
//       return response;
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//     initWebSocket(ws);

//     if (activity.id) {
//       localStorage.setItem('activityId', activity.id);
//       getGroups();
//     }

//     return () => {
//       ws.disconnect();
//     };
//   }, [activity.id]);

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`;
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Intl.DateTimeFormat('zh-TW', {
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: false,
//     }).format(new Date(timestamp));
//   };

//   const handleEnter = async (e) => {
//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//         console.log("getActivityInfo", activityInfo);
//         window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//         console.error(error);
//         window.open("/forum", '_blank');
//       });
//   };

//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const toggleActivityVisibility = (activityId) => {
//     const updatedHiddenActivities = { ...hiddenActivities, [activityId]: true };
//     setHiddenActivities(updatedHiddenActivities);
//     localStorage.setItem('hiddenActivities', JSON.stringify(updatedHiddenActivities));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const handleOpenHideDialog = (group) => {
//     setGroupToHide(group);
//     setOpenHideDialog(true);
//   };

//   const handleCloseHideDialog = () => {
//     setGroupToHide(null);
//     setOpenHideDialog(false);
//   };

//   const handleHideGroup = () => {
//     if (!groupToHide) return;
//     toggleGroupVisibility(groupToHide.id);
//     handleCloseHideDialog();
//   };

//   const handleOpenRenameDialog = () => {
//     setNewClassName(activity.title);
//     setOpenRenameDialog(true);
//   };

//   const handleCloseRenameDialog = () => {
//     setOpenRenameDialog(false);
//     setNewClassName(activity.title);
//   };

//   const handleRenameClass = async () => {
//     if (!newClassName.trim()) {
//       alert("班級名稱不能為空！");
//       return;
//     }

//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       await axios.put(`${baseUrl}/api/activities/${activity.id}`, {
//         title: newClassName,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//       });

//       activity.title = newClassName;
//       alert("班級名稱修改成功！");
//       sendMessage(ws);
//     } catch (error) {
//       console.error("修改班級名稱失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url,
//       });
//       alert("修改班級名稱失敗，請稍後再試！");
//     } finally {
//       handleCloseRenameDialog();
//     }
//   };

//   const handleOpenDeleteDialog = () => {
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleDeleteClass = () => {
//     console.log("正在刪除班級:", activity.id);
//     // 將班級標記為隱藏
//     toggleActivityVisibility(activity.id);

//     // 通知父組件移除該班級（從顯示列表中移除）
//     if (onDelete) {
//       console.log("調用 onDelete，移除班級:", activity.id);
//       onDelete(activity.id);
//     }

//     alert("班級已刪除！");
//     handleCloseDeleteDialog();
//   };

//   // 處理跳轉到 /Studentlist 頁面
//   const handleViewStudentStatus = () => {
//     navigate('/Studentlist');
//   };

//   // 如果班級被隱藏，則不渲染該組件
//   if (hiddenActivities[activity.id]) {
//     console.log("班級被隱藏，不渲染:", activity.id);
//     return null;
//   }

//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => {
//                     if (option.modalKey) {
//                       openModal(option.modalKey);
//                     }
//                     if (option.onClick) {
//                       option.onClick();
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto', display: 'flex', gap: '10px' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開主題列表 ▼
//             </Button>
//             <Button className='enter-activity-button' onClick={handleViewStudentStatus}>
//               查看學生學習狀況
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 主題列表
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button
//                         className='enter-activity-button'
//                         onClick={(e) => {
//                           localStorage.setItem('groupId', group.id);
//                           localStorage.setItem('joinCode', group.joinCode);
//                           handleEnter(e);
//                         }}
//                       >
//                         進入名單
//                       </Button>
//                       <Button
//                         className='hidden-button'
//                         onClick={() => handleOpenHideDialog(group)}
//                         style={{ background: '#e3dffd', fontSize: "24px" }}
//                       >
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText
//                       primary={group.groupName}
//                       secondary={"小組邀請碼：\n" + group.joinCode}
//                       secondaryTypographyProps={{
//                         style: {
//                           whiteSpace: 'pre-wrap', // 允許換行，識別 \n
//                         },
//                       }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入要新增的小組數量：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="numGroups"
//             label="小組數量"
//             type="number"
//             fullWidth
//             variant="standard"
//             value={numGroupsToCreate}
//             onChange={(e) => setNumGroupsToCreate(parseInt(e.target.value, 10))}
//             inputProps={{ min: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text"
//             color="primary"
//           >
//             取消
//           </MuiButton>
//           <MuiButton
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(numGroupsToCreate);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setNumGroupsToCreate(1);
//             }}
//             disabled={creatingGroups}
//             variant="text"
//             color="primary"
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 隱藏確認對話框 */}
//       <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
//         <DialogTitle>刪除主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             是否要刪除此主題「{groupToHide?.groupName}」？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseHideDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleHideGroup} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 修改班級名稱對話框 */}
//       <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog}>
//         <DialogTitle>修改班級名稱</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入新的班級名稱：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="className"
//             label="班級名稱"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newClassName}
//             onChange={(e) => setNewClassName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseRenameDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleRenameClass} variant="text" color="primary">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 刪除班級確認對話框 */}
//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
//         <DialogTitle>刪除班級</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要刪除此班級「{activity.title}」？連同班級內的主題也會一併刪除。
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseDeleteDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleDeleteClass} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//     </div>
//   );
// }






// import React, { useState, useEffect } from 'react';
// import config from '../config.json';
// import axios from "axios";
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AssignmentIcon from '../assets/Chart.svg';
// import addgroup from '../assets/Add.svg';
// import EditIcon from '../assets/Pencil.svg';
// import TrashIcon from '../assets/trash.svg';
// import ActivityGroupingIcon from '../assets/group.svg';
// import { Button } from '@mui/base';
// import { Button as MuiButton } from '@mui/material';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { sendMessage } from '../utils/socketTool';
// import { findroomByInfo } from '../utils/findRoomMode';
// import url from '../url.json';
// import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
// import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
// import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
// import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';
// import dayjs from 'dayjs';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// const Item = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   color: theme.palette.text.secondary,
//   width: '420px', // 固定寬度
//   minHeight: '200px', // 最小高度
// }));

// const EnterActivity = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// const getIconByLabel = (label) => {
//   switch (label) {
//     case "mindmap":
//       return RoomSettingsMindmapIcon;
//     case "chatroom":
//       return RoomSettingsChatroomIcon;
//     case "posts":
//       return RoomSettingsPostIcon;
//     default:
//       return null;
//   }
// }

// const ITEM_HEIGHT = 48;

// export default function MyCreatedActivityCard({ activity, onDelete }) {
//   const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [groupData, setGroupData] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedModal, setSelectedModal] = useState(null);
//   const [selectedModalOpen, setSelectedModalOpen] = useState(false);
//   const [hiddenGroups, setHiddenGroups] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenGroups');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenGroups 失敗:", error);
//       return {};
//     }
//   });
//   const [hiddenActivities, setHiddenActivities] = useState(() => {
//     try {
//       const stored = localStorage.getItem('hiddenActivities');
//       return stored ? JSON.parse(stored) : {};
//     } catch (error) {
//       console.error("解析 hiddenActivities 失敗:", error);
//       return {};
//     }
//   });
//   const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
//   const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
//   const [creatingGroups, setCreatingGroups] = useState(false);
//   const [roomSetting, setRoomSetting] = useState(null);
//   const [openHideDialog, setOpenHideDialog] = useState(false);
//   const [groupToHide, setGroupToHide] = useState(null);
//   const [openRenameDialog, setOpenRenameDialog] = useState(false);
//   const [newClassName, setNewClassName] = useState(activity.title);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

//   // 新增狀態來儲存主題名稱和日期
//   const [groupFormData, setGroupFormData] = useState({
//     groupName: "",
//     startDate: dayjs(),
//     endDate: dayjs().add(1, 'month'),
//   });

//   const open = Boolean(anchorEl);

//   const createGroup = async (formData) => {
//     const activityId = localStorage.getItem('activityId');
//     if (!activityId) {
//       alert("活動 ID 無效，請重新選擇活動！");
//       return;
//     }
//     if (!formData.groupName.trim()) {
//       alert("主題名稱不能為空！");
//       return;
//     }
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;

//     let newGroups = [];

//     try {
//       console.log('開始創建小組，活動 ID:', activityId);

//       // 創建小組，傳入自定義的主題名稱和日期
//       const groupData = {
//         groupName: formData.groupName,
//         activityId: activityId,
//         numGroups: 1,
//         startDate: formData.startDate.toISOString(),
//         endDate: formData.endDate.toISOString(),
//       };
//       console.log('創建小組:', groupData);
//       const response = await axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData);
//       newGroups = response.data.groups || [];
//       console.log('新創建的小組:', newGroups);

//       const userId = localStorage.getItem('userId');
//       const joinGroupPromises = newGroups.map(group => {
//         const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
//         console.log('加入小組 URL:', joinUrl);
//         return axios.put(joinUrl, { userId });
//       });
//       await Promise.all(joinGroupPromises);
//       console.log('加入小組成功');

//       sendMessage(ws);
//       alert(`主題新增成功`);
//       setAnchorEl(null);
//       setExpanded(true);

//       try {
//         const updatedGroups = await getGroups();
//         setGroupData(updatedGroups);
//         console.log('前端更新完成:', updatedGroups);
//       } catch (fetchError) {
//         console.warn('獲取小組列表失敗，手動更新:', fetchError);
//         setGroupData((prev) => [...prev, ...newGroups]);
//       }

//       const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
//       console.log('驗證後端資料:', verifyResponse.data);

//     } catch (error) {
//       console.error("創建或加入小組失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       if (newGroups.length > 0) {
//         setGroupData((prev) => [...prev, ...newGroups]);
//         setExpanded(true);
//         alert("主題已創建，但部分操作失敗，請稍後檢查！");
//       } else {
//         alert("新增主題失敗，請稍後再試！");
//       }
//       return;
//     }

//     try {
//       const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
//       console.log('發起 renew 請求:', renewUrl);
//       const renewResponse = await axios.get(renewUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('renew 回應:', renewResponse.data);
//       if (renewResponse.data.token) {
//         localStorage.setItem('jwtToken', renewResponse.data.token);
//       }
//     } catch (error) {
//       console.error("renew 請求失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url
//       });
//       alert("Token 刷新失敗，但小組已新增成功！");
//     }
//   };

//   const editClassSetting = () => {
//     getActivityInfo().then((response) => {
//       console.log("Room Settings", roomSetting);
//       if (response && response.data == '') {
//         postActivityInfo().then((initResponse) => {
//           console.log("initResponse", initResponse);
//           setRoomSetting(initResponse.data.settings);
//           setOpenSettingOfActivity(true);
//         });
//       } else {
//         setRoomSetting(response.data.settings);
//         setOpenSettingOfActivity(true);
//       }
//     });
//   };

//   const options = [
//     { text: '修改班級名稱', onClick: () => setOpenRenameDialog(true), icon: EditIcon },
//     // { text: '刪除班級', onClick: () => setOpenDeleteDialog(true), icon: TrashIcon },
//     { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
//   ];

//   const handleClickMore = async (event) => {
//     setAnchorEl(event.currentTarget);
//     localStorage.setItem('activityId', activity.id);
//     try {
//       const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
//       const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
//       localStorage.setItem('groupIds', JSON.stringify(groupIds));
//       if (groupIds.length > 0) {
//         localStorage.setItem('groupId', groupIds[0]);
//       } else {
//         localStorage.removeItem('groupId');
//       }

//       for (const key in localStorage) {
//         if (localStorage.hasOwnProperty(key)) {
//           const value = localStorage.getItem(key);
//           sessionStorage.setItem(key, value);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching groups:", err);
//     }
//   };

//   const handleCloseMore = () => {
//     setAnchorEl(null);
//   };

//   const openModal = (modalKey) => {
//     setSelectedModal(modalKey);
//     setSelectedModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedModal(null);
//     setSelectedModalOpen(false);
//   };

//   const openInNewTab = (url) => {
//     window.open(url, "_blank", "noreferrer");
//     localStorage.setItem('activityId', activity.id);
//     setSelectedModal(null);
//   };

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log("WebSocket connected");
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log("WebSocket event02", arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };

//   const getActivityInfo = async () => {
//     try {
//       const response = await axios.get(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'));
//       localStorage.setItem('activityInfo', JSON.stringify(response.data));
//       console.log("getActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("獲取活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const postActivityInfo = async () => {
//     try {
//       const response = await axios.post(url.backendHost + 'api/activityInfo/', {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//       });
//       console.log("postActivityInfo", response);
//       return response;
//     } catch (error) {
//       console.error("發送活動資訊失敗:", error);
//       throw error;
//     }
//   };

//   const putActivityInfo = async (roomSetting) => {
//     try {
//       const response = await axios.put(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'), {
//         activityId: localStorage.getItem('activityId'),
//         userId: localStorage.getItem('userId'),
//         settings: roomSetting
//       });
//       console.log("putActivityInfo", response);
//       return response;
//     } catch (err) {
//       alert("Error updating activity info: Json Error");
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
//     initWebSocket(ws);

//     if (activity.id) {
//       localStorage.setItem('activityId', activity.id);
//       getGroups();
//     }

//     return () => {
//       ws.disconnect();
//     };
//   }, [activity.id]);

//   const getGroups = async () => {
//     const activityId = localStorage.getItem('activityId');
//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`;
//       console.log('獲取活動 URL:', activityUrl);
//       const fetchData = await axios.get(activityUrl, {
//         headers: { 'Cache-Control': 'no-cache' },
//       });
//       console.log('活動資料:', fetchData.data);
//       const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
//       setGroupData(sortedGroups);
//       console.log('groupData 已更新:', sortedGroups);
//       return sortedGroups;
//     } catch (err) {
//       console.error("獲取小組失敗詳情:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//         url: err.config?.url
//       });
//       throw err;
//     }
//   };

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//     localStorage.setItem('activityId', activity.id);
//     getGroups();
//   };

//   const formatTimestamp = (timestamp) => {
//     // 如果 timestamp 是 undefined 或無效，返回一個預設值
//     if (!timestamp) {
//       return "未知日期";
//     }
//     try {
//       const date = new Date(timestamp);
//       // 檢查日期是否有效
//       if (isNaN(date.getTime())) {
//         return "無效日期";
//       }
//       return new Intl.DateTimeFormat('zh-TW', {
//         year: 'numeric',
//         month: 'numeric',
//         day: 'numeric',
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: false,
//       }).format(date);
//     } catch (error) {
//       console.error("日期格式化失敗:", error);
//       return "日期格式錯誤";
//     }
//   };

//   const handleEnter = async (e) => {
//     e.preventDefault();
//     localStorage.setItem('activityId', activity.id);

//     try {
//       await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
//     } catch (error) {
//       if (error.response) {
//         console.error("Server responded with error:", error.response);
//       } else if (error.request) {
//         console.error("Network error:", error.request);
//       } else {
//         console.error("Error:", error.message);
//       }
//     }

//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       const value = localStorage.getItem(key);
//       sessionStorage.setItem(key, value);
//     }

//     getActivityInfo()
//       .then((activityInfo) => {
//         console.log("getActivityInfo", activityInfo);
//         window.open(findroomByInfo(activityInfo), '_blank');
//       })
//       .catch((error) => {
//         console.error(error);
//         window.open("/forum", '_blank');
//       });
//   };

//   const toggleGroupVisibility = (groupId) => {
//     const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const toggleActivityVisibility = (activityId) => {
//     const updatedHiddenActivities = { ...hiddenActivities, [activityId]: true };
//     setHiddenActivities(updatedHiddenActivities);
//     localStorage.setItem('hiddenActivities', JSON.stringify(updatedHiddenActivities));
//   };

//   const showAllHiddenGroups = () => {
//     const updatedHiddenGroups = {};
//     setHiddenGroups(updatedHiddenGroups);
//     localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
//   };

//   const handleOpenHideDialog = (group) => {
//     setGroupToHide(group);
//     setOpenHideDialog(true);
//   };

//   const handleCloseHideDialog = () => {
//     setGroupToHide(null);
//     setOpenHideDialog(false);
//   };

//   const handleHideGroup = () => {
//     if (!groupToHide) return;
//     toggleGroupVisibility(groupToHide.id);
//     handleCloseHideDialog();
//   };

//   const handleOpenRenameDialog = () => {
//     setNewClassName(activity.title);
//     setOpenRenameDialog(true);
//   };

//   const handleCloseRenameDialog = () => {
//     setOpenRenameDialog(false);
//     setNewClassName(activity.title);
//   };

//   const handleRenameClass = async () => {
//     if (!newClassName.trim()) {
//       alert("班級名稱不能為空！");
//       return;
//     }

//     const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
//     try {
//       await axios.put(`${baseUrl}/api/activities/${activity.id}`, {
//         title: newClassName,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//         },
//       });

//       activity.title = newClassName;
//       alert("班級名稱修改成功！");
//       sendMessage(ws);
//     } catch (error) {
//       console.error("修改班級名稱失敗:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//         url: error.config?.url,
//       });
//       alert("修改班級名稱失敗，請稍後再試！");
//     } finally {
//       handleCloseRenameDialog();
//     }
//   };

//   const handleOpenDeleteDialog = () => {
//     setOpenDeleteDialog(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setOpenDeleteDialog(false);
//   };

//   const handleDeleteClass = () => {
//     console.log("正在刪除班級:", activity.id);
//     // 將班級標記為隱藏
//     toggleActivityVisibility(activity.id);

//     // 通知父組件移除該班級（從顯示列表中移除）
//     if (onDelete) {
//       console.log("調用 onDelete，移除班級:", activity.id);
//       onDelete(activity.id);
//     }

//     alert("班級已刪除！");
//     handleCloseDeleteDialog();
//   };

//   // 處理跳轉到 /Studentlist 頁面
//   const handleViewStudentStatus = () => {
//     navigate('/Studentlist');
//   };

//   // 如果班級被隱藏，則不渲染該組件
//   if (hiddenActivities[activity.id]) {
//     console.log("班級被隱藏，不渲染:", activity.id);
//     return null;
//   }

//   return (
//     <div>
//       <Item>
//         <CardHeader
//           action={
//             <>
//               <IconButton
//                 aria-label="more"
//                 id="long-button"
//                 aria-controls={open ? 'long-menu' : undefined}
//                 aria-expanded={open ? 'true' : undefined}
//                 aria-haspopup="true"
//                 onClick={handleClickMore}
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 id="long-menu"
//                 MenuListProps={{
//                   'aria-labelledby': 'long-button',
//                 }}
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleCloseMore}
//                 PaperProps={{
//                   style: {
//                     maxHeight: ITEM_HEIGHT * 4.5,
//                     width: '20ch',
//                   },
//                 }}
//               >
//                 {options.map((option, index) => (
//                   <MenuItem key={index} onClick={() => {
//                     if (option.modalKey) {
//                       openModal(option.modalKey);
//                     }
//                     if (option.onClick) {
//                       option.onClick();
//                     }
//                   }}>
//                     <ListItemIcon
//                       sx={{
//                         minWidth: 0,
//                         maxWidth: 24,
//                         mr: open ? 3 : 'auto',
//                         justifyContent: 'center',
//                       }}
//                     >
//                       <img alt='' src={option.icon} />
//                     </ListItemIcon>
//                     <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </>
//           }
//           title={activity.title}
//         />
//         <CardContent>
//           <Typography variant="body2" color="text.secondary">
//             {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
//           </Typography>
//         </CardContent>
//         <CardActions disableSpacing>
//           <div style={{ marginRight: 'auto', display: 'flex', gap: '10px' }}>
//             <Button className='enter-activity-button' onClick={handleExpandClick}>
//               展開主題列表 ▼
//             </Button>
//             <Button className='enter-activity-button' onClick={handleViewStudentStatus}>
//               查看學生學習狀況
//             </Button>
//           </div>
//         </CardActions>
//         <Collapse in={expanded} timeout="auto" unmountOnExit>
//           <List
//             subheader={
//               <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 主題列表
//               </ListSubheader>
//             }
//           >
//             {groupData.map((group) => (
//               !hiddenGroups[group.id] && (
//                 <ListItem
//                   key={group.joinCode}
//                   disablePadding
//                   secondaryAction={
//                     <EnterActivity>
//                       <Button
//                         className='enter-activity-button'
//                         onClick={(e) => {
//                           localStorage.setItem('groupId', group.id);
//                           localStorage.setItem('joinCode', group.joinCode);
//                           handleEnter(e);
//                         }}
//                       >
//                         進入名單
//                       </Button>
//                       <Button
//                         className='hidden-button'
//                         onClick={() => handleOpenHideDialog(group)}
//                         style={{ background: '#e3dffd', fontSize: "24px" }}
//                       >
//                         x
//                       </Button>
//                     </EnterActivity>
//                   }
//                 >
//                   <ListItemButton>
//                     <ListItemText
//                       primary={group.groupName ? `主題：${group.groupName}` : "主題：未命名"}
//                       secondary={
//                         `主題邀請碼：${group.joinCode || "無邀請碼"}\n` +
//                         (group.startDate ? `開始日期：${formatTimestamp(group.startDate)}\n` : '') +
//                         (group.endDate ? `結束日期：${formatTimestamp(group.endDate)}` : '')
//                       }
//                       secondaryTypographyProps={{
//                         style: {
//                           whiteSpace: 'pre-wrap', // 允許換行，識別 \n
//                         },
//                       }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               )
//             ))}
//           </List>
//         </Collapse>
//       </Item>

//       {/* 新增小組對話框 */}
//       <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
//         <DialogTitle>新增主題</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="groupName"
//             label="主題名稱"
//             type="text"
//             name="groupName"
//             value={groupFormData.groupName}
//             fullWidth
//             variant="standard"
//             onChange={(e) => setGroupFormData({ ...groupFormData, groupName: e.target.value })}
//           />
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DemoContainer components={['DatePicker', 'DatePicker']}>
//               <DatePicker
//                 id="startDate"
//                 label="請選擇開始日期"
//                 format="YYYY-MM-DD"
//                 name="startDate"
//                 value={groupFormData.startDate}
//                 onChange={(newDate) => setGroupFormData({ ...groupFormData, startDate: newDate })}
//               />
//               <DatePicker
//                 id="endDate"
//                 label="請選擇結束日期"
//                 format="YYYY-MM-DD"
//                 name="endDate"
//                 value={groupFormData.endDate}
//                 onChange={(newDate) => setGroupFormData({ ...groupFormData, endDate: newDate })}
//               />
//             </DemoContainer>
//           </LocalizationProvider>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
//             variant="text"
//             color="primary"
//           >
//             取消
//           </MuiButton>
//           <MuiButton
//             onClick={async () => {
//               setCreatingGroups(true);
//               await createGroup(groupFormData);
//               setCreatingGroups(false);
//               setOpenCreateGroupDialog(false);
//               setGroupFormData({
//                 groupName: "",
//                 startDate: dayjs(),
//                 endDate: dayjs().add(1, 'month'),
//               });
//             }}
//             disabled={creatingGroups}
//             variant="text"
//             color="primary"
//           >
//             {creatingGroups ? '新增中...' : '確認'}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 隱藏確認對話框 */}
//       <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
//         <DialogTitle>刪除主題</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             是否要刪除此主題「{groupToHide?.groupName}」？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseHideDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleHideGroup} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 修改班級名稱對話框 */}
//       <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog}>
//         <DialogTitle>修改班級名稱</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請輸入新的班級名稱：
//           </DialogContentText>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="className"
//             label="班級名稱"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newClassName}
//             onChange={(e) => setNewClassName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseRenameDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleRenameClass} variant="text" color="primary">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 刪除班級確認對話框 */}
//       <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
//         <DialogTitle>刪除班級</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要刪除此班級「{activity.title}」？連同班級內的主題也會一併刪除。
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={handleCloseDeleteDialog} variant="text" color="primary">
//             取消
//           </MuiButton>
//           <MuiButton onClick={handleDeleteClass} variant="text" color="error">
//             確定
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* 活動室設定對話框 */}
//       <ActivitySettingsDialog
//         open={openSettingOfActivity}
//         onClose={() => setOpenSettingOfActivity(false)}
//         roomSetting={roomSetting}
//         setRoomSetting={setRoomSetting}
//         saveSettings={putActivityInfo}
//         getIconByLabel={getIconByLabel}
//       />

//       {selectedModal === 'enterPageOfPrepareLesson' && (
//         navigate('/teacher/pageOfPrepareLesson')
//       )}
//     </div>
//   );
// }















import React, { useState, useEffect } from 'react';
import config from '../config.json';
import axios from "axios";
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { styled, Card, CardHeader, CardContent, Typography, Checkbox, CardActions, IconButton, Menu, MenuItem, Collapse, List, ListItem, ListItemIcon, ListSubheader, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '../assets/Chart.svg';
import addgroup from '../assets/Add.svg';
import EditIcon from '../assets/Pencil.svg';
import TrashIcon from '../assets/trash.svg';
import ActivityGroupingIcon from '../assets/group.svg';
import { Button } from '@mui/base';
import { Button as MuiButton } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { sendMessage } from '../utils/socketTool';
import { findroomByInfo } from '../utils/findRoomMode';
import url from '../url.json';
import RoomSettingsChatroomIcon from "../assets/RoomSettings/chatroom.png";
import RoomSettingsPostIcon from "../assets/RoomSettings/posts.png";
import RoomSettingsMindmapIcon from "../assets/RoomSettings/mindmap.png";
import ActivitySettingsDialog from './Admin/ActivitySettingsDialog';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E3DFFD',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  width: '420px',
  minHeight: '200px',
}));

const EnterActivity = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const getIconByLabel = (label) => {
  switch (label) {
    case "mindmap":
      return RoomSettingsMindmapIcon;
    case "chatroom":
      return RoomSettingsChatroomIcon;
    case "posts":
      return RoomSettingsPostIcon;
    default:
      return null;
  }
}

const ITEM_HEIGHT = 48;

export default function MyCreatedActivityCard({ activity, onDelete }) {
  const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);
  const [hiddenGroups, setHiddenGroups] = useState(() => {
    try {
      const stored = localStorage.getItem('hiddenGroups');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("解析 hiddenGroups 失敗:", error);
      return {};
    }
  });
  const [hiddenActivities, setHiddenActivities] = useState(() => {
    try {
      const stored = localStorage.getItem('hiddenActivities');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("解析 hiddenActivities 失敗:", error);
      return {};
    }
  });
  const [openCreateGroupDialog, setOpenCreateGroupDialog] = useState(false);
  const [openSettingOfActivity, setOpenSettingOfActivity] = useState(false);
  const [creatingGroups, setCreatingGroups] = useState(false);
  const [roomSetting, setRoomSetting] = useState(null);
  const [openHideDialog, setOpenHideDialog] = useState(false);
  const [groupToHide, setGroupToHide] = useState(null);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [newClassName, setNewClassName] = useState(activity.title);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    groupName: "",
    startDate: dayjs(),
    endDate: dayjs().add(1, 'month'),
  });

  const open = Boolean(anchorEl);

  const createGroup = async (formData) => {
    const activityId = localStorage.getItem('activityId');
    if (!activityId) {
      alert("活動 ID 無效，請重新選擇活動！");
      return;
    }
    if (!formData.groupName.trim()) {
      alert("主題名稱不能為空！");
      return;
    }
    const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;

    let newGroups = [];

    try {
      console.log('開始創建小組，活動 ID:', activityId);
      const groupData = {
        groupName: formData.groupName,
        activityId: activityId,
        numGroups: 1,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      };
      console.log('創建小組:', groupData);
      const response = await axios.post(`${baseUrl}/${config[14].creatGroup}`, groupData);
      newGroups = response.data.groups || [];
      console.log('新創建的小組:', newGroups);

      const userId = localStorage.getItem('userId');
      const joinGroupPromises = newGroups.map(group => {
        const joinUrl = `${baseUrl}/api/groups/${group.joinCode}/join`;
        console.log('加入小組 URL:', joinUrl);
        return axios.put(joinUrl, { userId });
      });
      await Promise.all(joinGroupPromises);
      console.log('加入小組成功');

      sendMessage(ws);
      alert(`主題新增成功`);
      setAnchorEl(null);
      setExpanded(true);

      try {
        const updatedGroups = await getGroups();
        setGroupData(updatedGroups);
        console.log('前端更新完成:', updatedGroups);
      } catch (fetchError) {
        console.warn('獲取小組列表失敗，手動更新:', fetchError);
        setGroupData((prev) => [...prev, ...newGroups]);
      }

      const verifyResponse = await axios.get(`${baseUrl}/api/activities/${activityId}`);
      console.log('驗證後端資料:', verifyResponse.data);

    } catch (error) {
      console.error("創建或加入小組失敗:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      if (newGroups.length > 0) {
        setGroupData((prev) => [...prev, ...newGroups]);
        setExpanded(true);
        alert("主題已創建，但部分操作失敗，請稍後檢查！");
      } else {
        alert("新增主題失敗，請稍後再試！");
      }
      return;
    }

    try {
      const renewUrl = `${baseUrl}/${config[1].reNewTokenUrl}`;
      console.log('發起 renew 請求:', renewUrl);
      const renewResponse = await axios.get(renewUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('renew 回應:', renewResponse.data);
      if (renewResponse.data.token) {
        localStorage.setItem('jwtToken', renewResponse.data.token);
      }
    } catch (error) {
      console.error("renew 請求失敗:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url
      });
      alert("Token 刷新失敗，但小組已新增成功！");
    }
  };

  const editClassSetting = () => {
    getActivityInfo().then((response) => {
      console.log("Room Settings", roomSetting);
      if (response && response.data == '') {
        postActivityInfo().then((initResponse) => {
          console.log("initResponse", initResponse);
          setRoomSetting(initResponse.data.settings);
          setOpenSettingOfActivity(true);
        });
      } else {
        setRoomSetting(response.data.settings);
        setOpenSettingOfActivity(true);
      }
    });
  };

  const options = [
    { text: '修改班級名稱', onClick: () => setOpenRenameDialog(true), icon: EditIcon },
    { text: '新增主題', onClick: () => setOpenCreateGroupDialog(true), icon: addgroup },
  ];

  const handleClickMore = async (event) => {
    setAnchorEl(event.currentTarget);
    localStorage.setItem('activityId', activity.id);
    try {
      const fetchData = await axios.get(url.backendHost + config[15].findAllGroup + activity.id);
      const groupIds = fetchData.data.Groups.map(group => group.id).sort((a, b) => a - b);
      localStorage.setItem('groupIds', JSON.stringify(groupIds));
      if (groupIds.length > 0) {
        localStorage.setItem('groupId', groupIds[0]);
      } else {
        localStorage.removeItem('groupId');
      }

      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key);
          sessionStorage.setItem(key, value);
        }
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const openModal = (modalKey) => {
    setSelectedModal(modalKey);
    setSelectedModalOpen(true);
  };

  const closeModal = () => {
    setSelectedModal(null);
    setSelectedModalOpen(false);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
    localStorage.setItem('activityId', activity.id);
    setSelectedModal(null);
  };

  const initWebSocket = () => {
    ws.on('connect', () => {
      // console.log("WebSocket connected");
    });

    ws.on('event02', (arg, callback) => {
      // console.log("WebSocket event02", arg);
      callback({
        status: 'event02 ok',
      });
    });
  };

  const getActivityInfo = async () => {
    try {
      const response = await axios.get(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'));
      localStorage.setItem('activityInfo', JSON.stringify(response.data));
      console.log("getActivityInfo", response);
      return response;
    } catch (error) {
      console.error("獲取活動資訊失敗:", error);
      throw error;
    }
  };

  const postActivityInfo = async () => {
    try {
      const response = await axios.post(url.backendHost + 'api/activityInfo/', {
        activityId: localStorage.getItem('activityId'),
        userId: localStorage.getItem('userId'),
      });
      console.log("postActivityInfo", response);
      return response;
    } catch (error) {
      console.error("發送活動資訊失敗:", error);
      throw error;
    }
  };

  const putActivityInfo = async (roomSetting) => {
    try {
      const response = await axios.put(url.backendHost + 'api/activityInfo/' + localStorage.getItem('activityId'), {
        activityId: localStorage.getItem('activityId'),
        userId: localStorage.getItem('userId'),
        settings: roomSetting
      });
      console.log("putActivityInfo", response);
      return response;
    } catch (err) {
      alert("Error updating activity info: Json Error");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    const ws = io.connect(url.socketioHost, { path: '/s/socket.io' });
    initWebSocket(ws);

    if (activity.id) {
      localStorage.setItem('activityId', activity.id);
      getGroups();
    }

    return () => {
      ws.disconnect();
    };
  }, [activity.id]);

  const getGroups = async () => {
    const activityId = localStorage.getItem('activityId');
    const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
    try {
      const activityUrl = `${baseUrl}/${config[15].findAllGroup}${activityId}`;
      console.log('獲取活動 URL:', activityUrl);
      const fetchData = await axios.get(activityUrl, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('活動資料:', fetchData.data);
      const sortedGroups = fetchData.data.Groups.sort((a, b) => a.id - b.id);
      setGroupData(sortedGroups);
      console.log('groupData 已更新:', sortedGroups);
      return sortedGroups;
    } catch (err) {
      console.error("獲取小組失敗詳情:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        url: err.config?.url
      });
      throw err;
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
    localStorage.setItem('activityId', activity.id);
    getGroups();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return "未知日期";
    }
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "無效日期";
      }
      return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).format(date);
    } catch (error) {
      console.error("日期格式化失敗:", error);
      return "日期格式錯誤";
    }
  };

  const handleEnter = async (e) => {
    e.preventDefault();
    localStorage.setItem('activityId', activity.id);

    try {
      await axios.get(`${url.backendHost + config[16].EnterDifferentGroup}${localStorage.getItem('joinCode')}/${localStorage.getItem('userId')}`);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      sessionStorage.setItem(key, value);
    }

    getActivityInfo()
      .then((activityInfo) => {
        console.log("getActivityInfo", activityInfo);
        window.open(findroomByInfo(activityInfo), '_blank');
      })
      .catch((error) => {
        console.error(error);
        window.open("/forum", '_blank');
      });
  };

  const toggleGroupVisibility = (groupId) => {
    const updatedHiddenGroups = { ...hiddenGroups, [groupId]: !hiddenGroups[groupId] };
    setHiddenGroups(updatedHiddenGroups);
    localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
  };

  const toggleActivityVisibility = (activityId) => {
    const updatedHiddenActivities = { ...hiddenActivities, [activityId]: true };
    setHiddenActivities(updatedHiddenActivities);
    localStorage.setItem('hiddenActivities', JSON.stringify(updatedHiddenActivities));
  };

  const showAllHiddenGroups = () => {
    const updatedHiddenGroups = {};
    setHiddenGroups(updatedHiddenGroups);
    localStorage.setItem('hiddenGroups', JSON.stringify(updatedHiddenGroups));
  };

  const handleOpenHideDialog = (group) => {
    setGroupToHide(group);
    setOpenHideDialog(true);
  };

  const handleCloseHideDialog = () => {
    setGroupToHide(null);
    setOpenHideDialog(false);
  };

  const handleHideGroup = () => {
    if (!groupToHide) return;
    toggleGroupVisibility(groupToHide.id);
    handleCloseHideDialog();
  };

  const handleOpenRenameDialog = () => {
    setNewClassName(activity.title);
    setOpenRenameDialog(true);
  };

  const handleCloseRenameDialog = () => {
    setOpenRenameDialog(false);
    setNewClassName(activity.title);
  };

  const handleRenameClass = async () => {
    if (!newClassName.trim()) {
      alert("班級名稱不能為空！");
      return;
    }

    const baseUrl = url.backendHost.endsWith('/') ? url.backendHost.slice(0, -1) : url.backendHost;
    try {
      await axios.put(`${baseUrl}/api/activities/${activity.id}`, {
        title: newClassName,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      activity.title = newClassName;
      alert("班級名稱修改成功！");
      sendMessage(ws);
    } catch (error) {
      console.error("修改班級名稱失敗:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
      });
      alert("修改班級名稱失敗，請稍後再試！");
    } finally {
      handleCloseRenameDialog();
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteClass = () => {
    console.log("正在刪除班級:", activity.id);
    toggleActivityVisibility(activity.id);

    if (onDelete) {
      console.log("調用 onDelete，移除班級:", activity.id);
      onDelete(activity.id);
    }

    alert("班級已刪除！");
    handleCloseDeleteDialog();
  };

  const handleViewStudentStatus = () => {
    // 確保在導航前設置 activityId
    localStorage.setItem('activityId', activity.id);
    console.log("Navigating to Studentlist with activityId:", activity.id);
    navigate('/Studentlist');
  };

  if (hiddenActivities[activity.id]) {
    console.log("班級被隱藏，不渲染:", activity.id);
    return null;
  }

  return (
    <div>
      <Item>
        <CardHeader
          action={
            <>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClickMore}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMore}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {options.map((option, index) => (
                  <MenuItem key={index} onClick={() => {
                    if (option.modalKey) {
                      openModal(option.modalKey);
                    }
                    if (option.onClick) {
                      option.onClick();
                    }
                  }}>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        maxWidth: 24,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <img alt='' src={option.icon} />
                    </ListItemIcon>
                    <ListItemText primary={option.text} sx={{ opacity: open ? 1 : 0 }} style={{ color: '#8B8B8B' }} />
                  </MenuItem>
                ))}
              </Menu>
            </>
          }
          title={activity.title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {`${formatTimestamp(activity.startDate)} ~ ${formatTimestamp(activity.endDate)}`}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <div style={{ marginRight: 'auto', display: 'flex', gap: '10px' }}>
            <Button className='enter-activity-button' onClick={handleExpandClick}>
              展開主題列表 ▼
            </Button>
            <Button className='enter-activity-button' onClick={handleViewStudentStatus}>
              查看學生學習狀況
            </Button>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                主題列表
              </ListSubheader>
            }
          >
            {groupData.map((group) => (
              !hiddenGroups[group.id] && (
                <ListItem
                  key={group.joinCode}
                  disablePadding
                  secondaryAction={
                    <EnterActivity>
                      <Button
                        className='enter-activity-button'
                        onClick={(e) => {
                          localStorage.setItem('groupId', group.id);
                          localStorage.setItem('joinCode', group.joinCode);
                          handleEnter(e);
                        }}
                      >
                        進入名單
                      </Button>
                      <Button
                        className='hidden-button'
                        onClick={() => handleOpenHideDialog(group)}
                        style={{ background: '#e3dffd', fontSize: "24px" }}
                      >
                        x
                      </Button>
                    </EnterActivity>
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={group.groupName ? `主題：${group.groupName}` : "主題：未命名"}
                      secondary={
                        `主題邀請碼：${group.joinCode || "無邀請碼"}\n` +
                        (group.startDate ? `開始日期：${formatTimestamp(group.startDate)}\n` : '') +
                        (group.endDate ? `結束日期：${formatTimestamp(group.endDate)}` : '')
                      }
                      secondaryTypographyProps={{
                        style: {
                          whiteSpace: 'pre-wrap',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </Collapse>
      </Item>

      <Dialog open={openCreateGroupDialog} onClose={() => setOpenCreateGroupDialog(false)}>
        <DialogTitle>新增主題</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="groupName"
            label="主題名稱"
            type="text"
            name="groupName"
            value={groupFormData.groupName}
            fullWidth
            variant="standard"
            onChange={(e) => setGroupFormData({ ...groupFormData, groupName: e.target.value })}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                id="startDate"
                label="請選擇開始日期"
                format="YYYY-MM-DD"
                name="startDate"
                value={groupFormData.startDate}
                onChange={(newDate) => setGroupFormData({ ...groupFormData, startDate: newDate })}
              />
              <DatePicker
                id="endDate"
                label="請選擇結束日期"
                format="YYYY-MM-DD"
                name="endDate"
                value={groupFormData.endDate}
                onChange={(newDate) => setGroupFormData({ ...groupFormData, endDate: newDate })}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenCreateGroupDialog(false)}
            variant="text"
            color="primary"
          >
            取消
          </MuiButton>
          <MuiButton
            onClick={async () => {
              setCreatingGroups(true);
              await createGroup(groupFormData);
              setCreatingGroups(false);
              setOpenCreateGroupDialog(false);
              setGroupFormData({
                groupName: "",
                startDate: dayjs(),
                endDate: dayjs().add(1, 'month'),
              });
            }}
            disabled={creatingGroups}
            variant="text"
            color="primary"
          >
            {creatingGroups ? '新增中...' : '確認'}
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openHideDialog} onClose={handleCloseHideDialog}>
        <DialogTitle>刪除主題</DialogTitle>
        <DialogContent>
          <DialogContentText>
            是否要刪除此主題「{groupToHide?.groupName}」？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseHideDialog} variant="text" color="primary">
            取消
          </MuiButton>
          <MuiButton onClick={handleHideGroup} variant="text" color="error">
            確定
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openRenameDialog} onClose={handleCloseRenameDialog}>
        <DialogTitle>修改班級名稱</DialogTitle>
        <DialogContent>
          <DialogContentText>
            請輸入新的班級名稱：
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="className"
            label="班級名稱"
            type="text"
            fullWidth
            variant="standard"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseRenameDialog} variant="text" color="primary">
            取消
          </MuiButton>
          <MuiButton onClick={handleRenameClass} variant="text" color="primary">
            確定
          </MuiButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>刪除班級</DialogTitle>
        <DialogContent>
          <DialogContentText>
            確定要刪除此班級「{activity.title}」？連同班級內的主題也會一併刪除。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseDeleteDialog} variant="text" color="primary">
            取消
          </MuiButton>
          <MuiButton onClick={handleDeleteClass} variant="text" color="error">
            確定
          </MuiButton>
        </DialogActions>
      </Dialog>

      <ActivitySettingsDialog
        open={openSettingOfActivity}
        onClose={() => setOpenSettingOfActivity(false)}
        roomSetting={roomSetting}
        setRoomSetting={setRoomSetting}
        saveSettings={putActivityInfo}
        getIconByLabel={getIconByLabel}
      />

      {selectedModal === 'enterPageOfPrepareLesson' && (
        navigate('/teacher/pageOfPrepareLesson')
      )}
    </div>
  );
}