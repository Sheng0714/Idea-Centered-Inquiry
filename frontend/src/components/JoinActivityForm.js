import config from '../config.json';
import axios from "axios";
import React, { useState } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from '@mui/material';
import joinActivityImg from '../assets/undraw_join_re_w1lh.svg';
import url from '../url.json';

export const JoinActivityForm = ({ callback_setActivities }) => {
    const userId = localStorage.getItem('userId'); 
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        userId: userId,
        joinCode: ""
    });
    const [activityData, setActivityData] = useState({
        ActivityGroup:{
            Activity: {
                createdAt: '',
                endDate: '',
                title: ''
            },
            Group: {
                groupName: ''
            }
        }
    })
    
    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const activityData = {
            userId: data.userId,
        };
        axios
            .put(`${url.backendHost + config[5].joinActivity}/${data.joinCode}/join`, activityData)
            .then((groupRes) => {

                axios.get(`${url.backendHost + config[4].myJoinedActivityList}/${data.userId}`).then((fetchData)=>{
                    callback_setActivities(fetchData.data);
                    console.log(`fetchdata-response: ${fetchData.data}`);
                    setOpen(false);
                    setData({
                        userId: userId,
                        joinCode: ""
                    });

                    // renew token
                    axios.get(url.backendHost + config[1].reNewTokenUrl)
                    
                    // console.log('加入活動成功~🎉');
                    alert("Successfully joined the topic!");
                    window.location.reload();
                    
                  }).catch((error) => {
                        alert("取得主題失敗...");
                  })
            })
            .catch((error) => {
                alert("Failed to join the topic. Please check the invitation code!");
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
  
    return (
      <div>
        <>  
            <div onClick={handleClickOpen}>
                Add Topic
            </div>
        </>
        <Dialog open={open} onClose={handleClose}>
            <div>
              <img className='modal-image' src={joinActivityImg} />
            </div>
            <DialogTitle>Add Topic</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label={"Please enter the invitation code"}
                    type="text"
                    name='joinCode'
                    value={data.joinCode}
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button type='submit' onClick={handleSubmit}>Join</Button>
            </DialogActions>
        </Dialog>
      </div>
    );
}