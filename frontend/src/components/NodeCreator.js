import React, { useState } from 'react';
import { Button, ButtonGroup, Dialog, DialogActions,DialogContentText, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, TextField, InputLabel, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { newNode, newEdge } from '../utils/ideaTool';
import LexicalEditor from "./Editor";


export const NodeCreator = ({ open, onClose, ws , nodePlan}) => {

    const name = localStorage.getItem('name');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState();
    const [title, setTitle] = useState("");



    const titleContentChange = (e) => {
        const value = e.target.value;
        setTitle(value);
    };


    const handleSubmit = async (e) => {
      e.preventDefault();
      const isTitleValid = title.trim().length > 0;
      const titleValidLength = title.trim().length < 15;
      if(
        !isTitleValid || 
        !titleValidLength || 
        !content || 
        !content.length > 0
      ) {
        return alert("請確定以下項目： \n1. 標題及內容都已輸入\n2. 標題長度不超過15個字");
      }
      const ideaData = {
        title: title,
        content: content,
        tags: nodePlan.tags || "idea",
        author: name,
        groupId: sessionStorage.getItem('groupId')
      };
      setLoading(true);
      try {
        const responseFromPostNode = await newNode(ideaData, sessionStorage.getItem('activityId'),ws);
        if(nodePlan.newEdge){
          const edgeData = {
            groupId: sessionStorage.getItem('groupId'),
            from: responseFromPostNode.data.node.id,
            to: sessionStorage.getItem('nodeId'),
          };
          const responseFromPostEdge = await newEdge(edgeData, sessionStorage.getItem('activityId'), ws);
        }
        
        alert("新增成功");
        onClose(onClose);
        setLoading(false);
      }
      catch(error){
        alert("新增失敗");
          if (error.response) {
              // console.log(error.response);
              // console.log("server responded");
              setLoading(false);
          } else if (error.request) {
              // console.log("network error");
              setLoading(false);
          } else {
              // console.log(error);
              setLoading(false);
          }
      }; 
    };

    return (
      <>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          scroll='body'
        >
          <DialogTitle>{nodePlan.title}</DialogTitle>

          <Divider variant="middle" />
          <DialogContent>
            {nodePlan.note && (
              <DialogContentText id="alert-dialog-description" >   
              <>
                  正在回應：
                  <div dangerouslySetInnerHTML={{ __html: nodePlan.note }} style={{padding: '10px'}} />
              </>
              </DialogContentText>
            )}
            回應標題：
            <FormControl variant="standard" fullWidth>
              <TextField
                required
                id="standard-required"
                autoFocus
                margin="dense"
                label={nodePlan.lable}
                type="text"
                name='title'
                value={title}
                fullWidth
                variant="standard"
                onChange={titleContentChange}
                inputProps={{ maxLength: 15 }}
              />
              <FormHelperText id="component-helper-text">
                {nodePlan.helperMsg}
              </FormHelperText>
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                '& > *': {
                  m: 1,
                },
              }}
            >

              <LexicalEditor 
                changeFunc={(content)=>{
                  console.log("content: ",content);
                  setContent(content);
                }}
                nodePlan={nodePlan}
                
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <LoadingButton type='submit' onClick={handleSubmit} loading={loading} loadingPosition="start" variant="contained">送出</LoadingButton>
          </DialogActions>
        </Dialog>
      </>
    );
}