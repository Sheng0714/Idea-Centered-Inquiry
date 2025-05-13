import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tooltip,
  Button,
  ButtonGroup,
  IconButton,
  Badge,
  Box,
  Avatar,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import CommunityIcon from '../assets/CommunityIcon.png';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import io from 'socket.io-client';
import url from '../url.json';
import config from '../config.json';
// import { socket } from '../utils/Socket';
import { newMessage } from '../utils/ideaTool';



export const GroupChatRoom = ({ activityData }) => {
  const [type, setType] = useState('type_choose');
  // const [typeMap, setTypeMap] = useState({
  //   想法發散: 'idea_divergent',
  //   想法收斂: 'idea_convergent',
  // });
  const [stage, setStage] = useState('stage_zero');
  const [ws, setSocket] = useState(null);
  const [nodeData, setNodeData] = useState(null);
  const [topic, setTopic] = useState('');
  // const [buttonChoice, setButtonChoice] = useState();
  // const [activity, setActivity] = useState(activityData);
  const userId = localStorage.getItem('userId');
  const author = localStorage.getItem('name');
  const groupId = localStorage.getItem('groupId');
  const [message, setMessage] = useState('');
  // const [messageList, setMessageList] = useState([
  //   {
  //     content:
  //       '看來你們需要進行想法收斂的 Meta-Talk，請你們進行小組討論並且摘要出你們在這個探究活動所提出的想法，並且在聊天室提出你們摘要後的想法。',
  //     groupId: groupId,
  //     author: 'assistant',
  //   },
  // ]);
  const [messageList, setMessageList] = useState([
    {
      content: '哈囉，請根據你們遇到的問題，點選想要進行的 Meta-talk 類型吧：',
      groupId: groupId,
      author: 'assistant',
      button: ['想法發散', '想法收斂'],
    },
  ]);
  const [messageAlert, setMessageAlert] = useState([]);
  const [messageAlertCheck, setMessageAlertCheck] = useState(true);
  // const [alertMessage, setAlertMessage] = useState([
  //   [
  //     '你提出的想法似乎含有「冒犯性言論『',
  //     '』」，如果可以請修正你的言論，以理性且尊種的方式表達想法喔！',
  //   ],
  //   [
  //     '你提出的想法似乎含有「負面情緒」，建議你修正你的寫法為「',
  //     '」，請以積極且正向的方式表達想法喔！',
  //   ],
  //   ['你提出的想法似乎和討論問題無關，請聚焦於問題並重新思考喔！', ''],
  // ]);
  const [messageListTemp, setMessageListTemp] = useState({});
  // const [questionMessage, setQuestionMessage] = useState([
  //   '哈囉各位同學，請問是你們主動想進行 Meta-Talk，還是老師需要你們進行 Meta-Talk 呢？',
  // ]);
  const [checkGroupMessage, setCheckGroupMessage] = useState(false);
  const [chatRoomOpen, setChatRoomOpen] = useState(false);
  const [data, setData] = useState({
    userId: userId,
    groupId: groupId,
    author: author,
    content: message,
  });
  // const [sendActivityTitle, setSendActivityTitle] = useState(false);
  const [scaffold, setScaffold] = useState('');
  const buttonGroupRef = useRef(null);
  const [buttonGroupHeight, setButtonGroupHeight] = useState(0);

  const handlTypeChoose = async (buttonTitle) => {
    // setButtonChoice(buttonTitle);
    setMessageListTemp((prev) => ({
      ...prev,
      buttonChoice: buttonTitle,
    }));
    // setType(typeMap[buttonTitle]);
    setCheckGroupMessage(true);
  };

  useEffect(() => {
    if (messageListTemp.buttonChoice !== "empty")
      if (checkGroupMessage === true) {
        sendGroupMessage();
      }
  }, [messageListTemp.buttonChoice]);

  // Group Message
  const sendGroupMessage = async () => {
    console.log('Sending group message');
    console.log(type);
    // console.log(checkGroupMessage);
    console.log(messageListTemp);
    if (checkGroupMessage === true) {
      try {
        const response = await axios.post(
          `http://ml.hsueh.tw:8000/Xuan/NLP/${type}/${stage}`,
          messageListTemp
        );
        console.log('NLP server response:', response.data);
        // let messageData;
        // if (response.data.scaffold && response.data.scaffold.length > 0) {
        // const scaffoldTitles = response.data.scaffold.map(
        //   (scaffold) => scaffold
        // );
        // setScaffold(scaffoldTitles);
        async function sendMessagesSequentially(messages) {
          for (const message of messages) {
            await newMessage(message, ws);
            console.log('Message sent:', message);
          }
        }

        const messages = response.data.message.map((messageContent, index) => ({
          userId: data.userId,
          groupId: groupId,
          author: 'assistant',
          content: messageContent,
          scaffold: response.data.scaffold,
          button: response.data.button[index],
          type: response.data.type,
          stage: response.data.stage,
        }));

        sendMessagesSequentially(messages);
        // } else {
        //   // setScaffold([]);
        //   response.data.message.forEach((messageContent) => {
        //     let messageData = {
        //       userId: data.userId,
        //       groupId: groupId,
        //       author: 'assistant',
        //       content: messageContent,
        //       button: response.data.button[index],
        //       type: response.data.type,
        //       stage: response.data.stage,
        //     };
        //     console.log('send message', messageData);
        //     newMessage(messageData, ws);
        //   });
        // }
        return response.data;
      } catch (error) {
        console.error('Error sending message to NLP server:', error);
        return false;
      }
    } else {
    }
  };

  // Check Personal Message
  const checkMessage = async () => {
    const messagecheck = {
      message: message,
      topic: topic,
    };
    console.log('message_check', messagecheck);
    try {
      const response = await axios.post(
        `http://ml.hsueh.tw:8000/Xuan/NLP/message/check/${type}/${stage}`,
        messagecheck
      );
      console.log('NLP server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message to NLP server:', error);
      return false;
    }
  };

  // Send Personal Message
  const sendMessage = async () => {
    if (message !== '') {
      const checkMessageResult = await checkMessage();
      console.log(checkMessageResult);
      const isAllTrue = checkMessageResult.check === true;
      if (isAllTrue) {
        const messageData = {
          userId: data.userId,
          groupId: data.groupId,
          author: data.author,
          content: message,
        };
        console.log('send message', messageData);
        newMessage(messageData, ws);
        setMessage('');
      } else {
        setMessageAlert((prev) => [...prev, checkMessageResult.message]);
        console.log(checkMessageResult);
        setMessageAlertCheck(false);
        console.log('send message', messageAlert);
      }
    }
  };

  useEffect(() => {
    setSocket(io.connect(url.socketioHost,{path: '/s/socket.io'}));
    async function getNode() {
      await getNodes();
    }
    getNode();
  }, []);

  useEffect(() => {
    if (nodeData) {
      setMessageListTemp((prev) => ({
        ...prev,
        idea: nodeData,
      }));
      console.log(activityData.title);
    }
  }, [nodeData]);

  const getNodes = async () => {
    try {
      const fetchData = await axios.get(
        `${url.backendHost + config[8].getNode}/${localStorage.getItem(
          'groupId'
        )}`);

      if (fetchData.data && fetchData.data[0].Nodes) {
        const nodeDataList = fetchData.data[0].Nodes.map(
          (node) => `${node.title}:${node.content}`
        );
        setNodeData(nodeDataList);
        console.log(nodeDataList);
      } else {
        console.log('No nodes data available');
        setNodeData([]);
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    }
  };

  useEffect(() => {
    if (activityData) {
      setTopic(activityData.title);
      console.log('initWebSocket');
      setMessageListTemp((prev) => ({
        ...prev,
        topic: activityData.title,
        message: [],
      }));
      const receive_message = async (data) => {
        setMessageList((prev) => [...prev, data]);
        if (data.author !== 'assistant') {
          setMessageListTemp((prev) => ({
            ...prev,
            message: [...prev.message, data.content],
          }));
          setCheckGroupMessage(true);
        } else {
          setMessageListTemp((prev) => ({
            ...prev,
            buttonChoice: "empty",
          }));
          if (data.clear === true) {
            setMessageListTemp((prev) => ({
              ...prev,
              message: [],
            }));
          }
          console.log(data);
          if (data.scaffold) {
            setScaffold(data.scaffold);
            if (buttonGroupRef.current) {
              const height = buttonGroupRef.current.clientHeight;
              setButtonGroupHeight(height);
            }
          } else {
            setScaffold([]);
          }
          // setQuestionMessage([data.message]);
          setCheckGroupMessage(false);
          setType(data.type);
          setStage(data.stage);
        }
        // setSendActivityTitle(true);
      };
      ws.on(`message-receive-${groupId}`, receive_message);
    }
  }, [ws, activityData]);

  useEffect(() => {
    if (buttonGroupRef.current) {
      const height = buttonGroupRef.current.clientHeight;
      setButtonGroupHeight(height);
    }
  }, [chatRoomOpen]);

  useEffect(() => {
    if (buttonGroupRef.current) {
      const height = buttonGroupRef.current.clientHeight;
      setButtonGroupHeight(height);
    }
  }, [scaffold]);

  const handleScaffoldClick = (e) => {
    setMessage(e + message);
  };
  const doubleCheckYes = () => {
    setMessageAlertCheck(true);
    setMessageAlert([]);
    const messageData = {
      userId: data.id,
      groupId: data.groupId,
      author: data.author,
      content: message,
    };
    newMessage(messageData, ws);
    setMessage('');
  };
  const doubleCheckNo = () => {
    // setCheckGroupMessage(true);
    setMessageAlertCheck(true);
    setMessageAlert([]);
  };

  return (
    <>
      <Dialog
        open={messageAlertCheck === false}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'是否要重新提出想法？'}
        </DialogTitle>
        <DialogContent>
          {messageAlert.map((content, index) => (
            <React.Fragment key={index}>
              {index + 1}.&nbsp;&nbsp;&nbsp;
              {content}
              <br />
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={doubleCheckNo}>
            是
          </Button>
          <Button variant="outlined" onClick={doubleCheckYes} autoFocus>
            否
          </Button>
        </DialogActions>
      </Dialog>
      <Tooltip title="小組聊天室" arrow>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          onClick={() => setChatRoomOpen(!chatRoomOpen)}
          sx={{ position: 'relative' }}
        >
          <Badge color="error">
            <img alt="小組聊天室" src={CommunityIcon} width={24} height={24} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Box
        style={{ backgroundColor: '#ECF2FF' }}
        sx={{
          position: 'absolute',
          top: 50,
          right: 20,
        }}
      >
        {chatRoomOpen && (
          <>
            <Box
              sx={{
                width: '22vw',
                height: '75vh',
                border: '3px solid grey',
                marginBottom: '10px',
                borderRadius: 1,
                textAlign: 'center', // 让其子元素水平居中
              }}
            >
              <Button
                size="medium"
                variant="outlined"
                endIcon={<TaskAltRoundedIcon />}
                style={{
                  width: '98%',
                  marginTop: '1%',
                  marginBottom: '1%',
                  border: '3px solid',
                }}
                onClick={sendGroupMessage}
              >
                小組完成回覆
              </Button>
              <List
                sx={{
                  height: `calc(100% - ${buttonGroupHeight + 76}px)`, // 設置高度
                  overflowY: 'auto', // 設置垂直滾動條
                  /* 滾動條樣式開始 */
                  '&::-webkit-scrollbar': {
                    width: '8px', // 滾動條寬度
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1', // 軌道背景色
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888', // 滑塊背景色
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555', // 鼠標懸停時的滑塊背景色
                  },
                  /* 滾動條樣式結束 */
                }}
              >
                {/* 這裡是 List 中的內容 */}

                {messageList.map((message, index) => (
                  <ListItem
                    key={index}
                    style={{
                      justifyContent:
                        message.author === author ? 'flex-end' : 'flex-start',
                      flexDirection: 'column',
                      alignItems:
                        message.author === author ? 'flex-end' : 'flex-start',
                      color: 'black',
                    }}
                  >
                    <Avatar
                      className="chat-image avatar"
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {message.author === 'assistant' ? (
                        <SmartToyOutlinedIcon />
                      ) : (
                        <FaceOutlinedIcon />
                      )}
                    </Avatar>
                    <div
                      style={{
                        backgroundColor:
                          message.author === 'assistant'
                            ? 'lightblue'
                            : 'white',
                        borderRadius: '6px',
                        padding: '6px',
                      }}
                    >
                      {message.content
                        .split(/(?:\n|\\n)/)
                        .map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          // // alignItems: 'center', // This will vertically center the items
                          // // width: '100%', // Ensures the container takes the full width
                          // marginRight: '10px' // Adds padding at the top and bottom for spacing
                        }}
                      >
                        {message.button &&
                          message.button.map((btn, btnIndex) => (
                            <Button
                              color="primary"
                              variant="outlined"
                              key={btnIndex}
                              style={{
                                backgroundColor: 'white',
                                border: '2px solid',
                                marginTop: '5px',
                                marginBottom: '2px',
                                marginRight:
                                  btnIndex === message.button.length - 1
                                    ? '0'
                                    : '5px', // 除了最后一个按钮外，其他按钮右侧加10px边距
                                padding: '3px 10px',
                              }}
                              onClick={() => handlTypeChoose(btn)}
                            >
                              {btn}
                            </Button>
                          ))}
                      </div>
                    </div>
                    {message.author}
                  </ListItem>
                ))}
              </List>
              <div
                style={{
                  color: 'black',
                  textAlign: 'left',
                  marginLeft: '10px', // 将文字靠左
                }}
              >
                回覆鷹架按鈕（建議使用回覆鷹架）：
              </div>
              <ButtonGroup
                ref={buttonGroupRef}
                variant="outlined"
                aria-label="Basic button group"
                style={{
                  width: '98%',
                  height: 'fit-content',
                  display: 'flex', // 添加这行样式
                  flexWrap: 'wrap', // 添加这行样式
                  marginRight: '3px',
                  marginLeft: '3px',
                }}
              >
                {scaffold.length > 0 &&
                  scaffold.map((value, index) => (
                    <Button
                      key={index}
                      onClick={() => handleScaffoldClick(value)}
                      style={{
                        border: '2px solid',
                        borderRadius: '20px',
                        marginLeft: '5px',
                        marginTop: '5px',
                      }}
                    >
                      {value}
                    </Button>
                  ))}
              </ButtonGroup>
            </Box>
            <Box
              sx={{
                width: '22vw',
                height: '6vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '3px solid grey',
                borderRadius: 1,
              }}
            >
              <TextField
                placeholder="輸入訊息"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& label.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0)',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: 'rgba(255, 255, 255, 0)',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                  },
                }}
              />
              <IconButton onClick={sendMessage} sx={{ color: 'gray' }}>
                <SendRoundedIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default GroupChatRoom;
