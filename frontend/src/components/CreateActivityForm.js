// import config from '../config.json';
// import axios from "axios";
// import React, { useState } from 'react';
// import dayjs from 'dayjs';
// import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import createActivityImg from '../assets/undraw_creative_thinking_re_9k71.svg';
// import url from '../url.json';

// export const CreateActivityForm = ({ callback_setActivities }) => {
//     const userId = localStorage.getItem('userId');
//     const [loading, setLoading] = useState(false); 
//     const [open, setOpen] = useState(false);
//     const [data, setData] = useState({
//         title: "",
//         userId: userId,
//         startDate: dayjs(),
//         endDate: dayjs().add(1, 'month')
//     });

//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         // 重置表單數據為初始值
//         setData({
//             title: "",
//             userId: userId,
//             startDate: dayjs(),
//             endDate: dayjs().add(1, 'month')
//         });
//     };

//     const handleChange = (e) => {
//         const value = e.target.value;
//         setData({
//             ...data,
//             [e.target.name]: value
//         });
//     };

//     const handleDateChange = (name, newDate) => {
//         setData({
//             ...data,
//             [name]: newDate
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         const jwtToken = localStorage.getItem("jwtToken");
//         const headers = { Authorization: `Bearer ${jwtToken}` };
//         const activityData = {
//             userId: data.userId,
//             title: data.title,
//             startDate: data.startDate.toISOString(),
//             endDate: data.endDate.toISOString()
//         };
//         try {
//             const activityResponse = await axios.post(url.backendHost + config[2].createActivity, activityData, { headers });
//             const newActivity = activityResponse.data;
//             await axios.get(url.backendHost + config[1].reNewTokenUrl);
//             const groupData = {
//                 groupName: "第1組",
//                 activityId: newActivity.id,
//                 numGroups: 1
//             };
//             const groupResponse = await axios.post(url.backendHost + config[14].creatGroup, groupData, { headers });
//             const joinCode = groupResponse.data.groups[0].joinCode;
//             const joinData = { userId: data.userId };
//             await axios.put(`${url.backendHost + config[5].joinActivity}/${joinCode}/join`, joinData, { headers });
//             setOpen(false);
//             setData({
//                 title: "",
//                 userId: userId,
//                 startDate: dayjs(),
//                 endDate: dayjs().add(1, 'month')
//             });
//             callback_setActivities((prev) => [...prev, newActivity]);
//             alert("活動與小組建立成功");
//         } catch (error) {
//             console.error("建立活動或小組失敗:", error.response || error.message);
//             alert("建立活動或小組失敗，請稍後再試！");
//         } finally {
//             setLoading(false);
//         }
//     };
    
    
//     return (
//         <div>
//             <div onClick={handleClickOpen} style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}>
//                 建立探究活動
//             </div>
//             <Dialog open={open} onClose={handleClose}>
//                 <div>
//                     <img className='modal-image' src={createActivityImg} alt="Create Activity" />
//                 </div>
//                 <DialogTitle sx={{ color: 'black', textDecoration: 'none' }}>建立探究活動</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         id="title"
//                         label="探究活動主題名稱"
//                         type="text"
//                         name='title'
//                         value={data.title}
//                         fullWidth
//                         variant="standard"
//                         onChange={handleChange}
//                     />
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DemoContainer components={['DatePicker', 'DatePicker']}>
//                             <DatePicker
//                                 id="startDate"
//                                 label="請選擇開始日期"
//                                 textField={(params) => <TextField {...params} />}
//                                 format='YYYY-MM-DD'
//                                 name='startDate'
//                                 value={data.startDate}
//                                 onChange={(newDate) => handleDateChange('startDate', newDate)}
//                             />
//                             <DatePicker
//                                 id="endDate"
//                                 label="請選擇結束日期"
//                                 textField={(params) => <TextField {...params} />}
//                                 format='YYYY-MM-DD'
//                                 name='endDate'
//                                 value={data.endDate}
//                                 onChange={(newDate) => handleDateChange('endDate', newDate)}
//                             />
//                         </DemoContainer>
//                     </LocalizationProvider>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>取消</Button>
//                     <Button onClick={handleSubmit}>新增</Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };



import config from '../config.json';
import axios from "axios";
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import createActivityImg from '../assets/undraw_creative_thinking_re_9k71.svg';
import url from '../url.json';
import io from 'socket.io-client';

// 設置 axios 全局攔截器
axios.interceptors.request.use(config => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
        config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
});

// 初始化 Socket.IO
const socket = io(url.socketioHost, {
    withCredentials: true,
    auth: { token: localStorage.getItem('jwtToken') }
});

export const CreateActivityForm = ({ callback_setActivities }) => {
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        title: "",
        userId: userId,
        startDate: dayjs(),
        endDate: dayjs().add(1, 'month')
    });

    useEffect(() => {
        socket.on('activityUpdate', (updatedActivities) => {
            console.log('收到活動更新:', updatedActivities);
            callback_setActivities(updatedActivities); // 更新本地狀態
        });
        return () => socket.off('activityUpdate');
    }, [callback_setActivities]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setData({ title: "", userId: userId, startDate: dayjs(), endDate: dayjs().add(1, 'month') });
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleDateChange = (name, newDate) => {
        setData({ ...data, [name]: newDate });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     const activityData = {
    //         userId: data.userId,
    //         title: data.title,
    //         startDate: data.startDate.toISOString(),
    //         endDate: data.endDate.toISOString()
    //     };
    //     try {
    //         const activityResponse = await axios.post(url.backendHost + config[2].createActivity, activityData);
    //         const newActivity = activityResponse.data;
    //         await axios.get(url.backendHost + config[1].reNewTokenUrl);
    //         const groupData = { groupName: "第1組", activityId: newActivity.id, numGroups: 1 };
    //         const groupResponse = await axios.post(url.backendHost + config[14].creatGroup, groupData);
    //         const joinCode = groupResponse.data.groups[0].joinCode;
    //         const joinData = { userId: data.userId };
    //         await axios.put(`${url.backendHost + config[5].joinActivity}/${joinCode}/join`, joinData);

    //         // 可選：主動刷新活動列表
    //         const activitiesResponse = await axios.get(url.backendHost + '/api/activities');
    //         callback_setActivities(activitiesResponse.data);

    //         setOpen(false);
    //         setData({ title: "", userId: userId, startDate: dayjs(), endDate: dayjs().add(1, 'month') });
    //         alert("活動與小組建立成功");
    //     } catch (error) {
    //         console.error("建立活動或小組失敗:", error.response || error.message);
    //         alert("建立活動或小組失敗，請稍後再試！");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const activityData = {
            userId: data.userId,
            title: data.title,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString()
        };
        try {
            const activityResponse = await axios.post(url.backendHost + config[2].createActivity, activityData);
            const newActivity = activityResponse.data;
            await axios.get(url.backendHost + config[1].reNewTokenUrl);
            const groupData = { groupName: "第1組", activityId: newActivity.id, numGroups: 1 };
            const groupResponse = await axios.post(url.backendHost + config[14].creatGroup, groupData);
            const joinCode = groupResponse.data.groups[0].joinCode;
            const joinData = { userId: data.userId };
            await axios.put(`${url.backendHost + config[5].joinActivity}/${joinCode}/join`, joinData);
    
            // 嘗試驗證活動，若失敗仍更新本地狀態
            try {
                const verifyResponse = await axios.get(`${url.backendHost}/api/api/activities/${newActivity.id}`);
                console.log('活動驗證成功:', verifyResponse.data);
            } catch (verifyError) {
                if (verifyError.response?.status === 403) {
                    console.warn('活動創建成功但無權立即訪問');
                    callback_setActivities((prev) => [...prev, newActivity]); // 直接添加
                } else {
                    throw verifyError; // 其他錯誤繼續拋出
                }
            }
    
            // 可選：獲取完整列表
            const activitiesResponse = await axios.get(url.backendHost + '/api/activities');
            callback_setActivities(activitiesResponse.data);
    
            setOpen(false);
            setData({ title: "", userId: userId, startDate: dayjs(), endDate: dayjs().add(1, 'month') });
            alert("活動與小組建立成功");
        } catch (error) {
            console.error("錯誤詳情:", error.response?.data || error.message);
            if (error.response?.status === 403) {
                callback_setActivities((prev) => [...prev, newActivity]); // 仍更新本地狀態
                alert("班級已創建，但可能需要稍後查看！");
            } else {
                alert("建立活動或小組失敗，請稍後再試！");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div onClick={handleClickOpen} style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}>
                建立班級
            </div>
            <Dialog open={open} onClose={handleClose}>
                <div><img className='modal-image' src={createActivityImg} alt="Create Activity" /></div>
                <DialogTitle sx={{ color: 'black', textDecoration: 'none' }}>建立班級</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="輸入班級名稱"
                        type="text"
                        name="title"
                        value={data.title}
                        fullWidth
                        variant="standard"
                        onChange={handleChange}
                    />
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DatePicker']}>
                            <DatePicker
                                id="startDate"
                                label="請選擇開始日期"
                                format="YYYY-MM-DD"
                                name="startDate"
                                value={data.startDate}
                                onChange={(newDate) => handleDateChange('startDate', newDate)}
                            />
                            <DatePicker
                                id="endDate"
                                label="請選擇結束日期"
                                format="YYYY-MM-DD"
                                name="endDate"
                                value={data.endDate}
                                onChange={(newDate) => handleDateChange('endDate', newDate)}
                            />
                        </DemoContainer>
                    </LocalizationProvider> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmit} disabled={loading}>新增</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};