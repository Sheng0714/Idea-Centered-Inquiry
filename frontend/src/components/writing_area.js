// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState(''); // State for activity title
//   const [groupName, setGroupName] = useState(''); // State for group name
//   const iframeRef = useRef(null);

//   // Load activity title and group name from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('editorData');
//     if (savedData) {
//       setEditorContent(savedData);
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 儲存編輯器內容到 localStorage（繳交上傳）
//   const handleSubmit = () => {
//     localStorage.setItem('editorData', editorContent);
//     alert('繳交上傳成功!');
//   };

//   // 暫存編輯器內容
//   const handleTempSave = () => {
//     localStorage.setItem('editorData', editorContent);
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             寫作精靈
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               筆記區
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 創建新聊天
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 查看聊天歷史
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             <span>
//               {activityTitle && `班級: ${activityTitle}`}
//               {groupName && ` | 主題: ${groupName}`}
//             </span>
//             <span>寫作區</span>
            
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               暫存
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//             >
//               繳交上傳
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>提醒</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請先與寫作精靈討論再開始寫作！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             我知道了!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>提示</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             暫存成功！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             確定
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>筆記區</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             儲存並關閉
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>聊天歷史紀錄</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>暫無聊天歷史紀錄</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>創建時間: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             聊天內容:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>無聊天內容</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             關閉
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;









// //繳交上傳到NOTION成功版本
// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
//   // 移除 withCredentials，因為目前不需要攜帶憑證
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const iframeRef = useRef(null);

//   // Load activity title, group name, and editor content from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('editorData');
//     if (savedData) {
//       setEditorContent(savedData);
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 將編輯器內容發送到後端，後端再提交到 Notion
//   const handleSubmit = async () => {
//     try {
//       // 儲存編輯器內容到 localStorage
//       localStorage.setItem('editorData', editorContent);

//       // 向後端發送請求
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: activityTitle || '未命名學生',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   // 暫存編輯器內容
//   const handleTempSave = () => {
//     localStorage.setItem('editorData', editorContent);
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             寫作精靈
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               筆記區
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 創建新聊天
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 查看聊天歷史
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             <span>
//               {activityTitle && `班級: ${activityTitle}`}
//               {groupName && ` | 主題: ${groupName}`}
//             </span>
//             <span>寫作區</span>
            
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               暫存
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//             >
//               繳交上傳
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>提醒</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請先與寫作精靈討論再開始寫作！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             我知道了!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>提示</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             暫存成功！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             確定
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>筆記區</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             儲存並關閉
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>聊天歷史紀錄</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>暫無聊天歷史紀錄</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>創建時間: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             聊天內容:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>無聊天內容</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             關閉
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;






// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
//   // 移除 withCredentials，因為目前不需要攜帶憑證
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // 新增狀態控制按鈕禁用
//   const iframeRef = useRef(null);

//   // Load activity title, group name, and editor content from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('editorData');
//     if (savedData) {
//       setEditorContent(savedData);
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 將編輯器內容發送到後端，後端再提交到 Notion
//   const handleSubmit = async () => {
//     try {
//       // 儲存編輯器內容到 localStorage
//       localStorage.setItem('editorData', editorContent);

//       // 向後端發送請求
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: activityTitle || '未命名學生',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true); // 繳交成功後禁用按鈕
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   // 暫存編輯器內容
//   const handleTempSave = () => {
//     localStorage.setItem('editorData', editorContent);
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             寫作精靈
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               筆記區
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 創建新聊天
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 查看聊天歷史
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             <span>
//               {activityTitle && `班級: ${activityTitle}`}
//               {groupName && ` | 主題: ${groupName}`}
//             </span>
//             <span>寫作區</span>
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               暫存
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//               disabled={isSubmitDisabled} // 根據狀態禁用按鈕
//             >
//               繳交上傳
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>提醒</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請先與寫作精靈討論再開始寫作！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             我知道了!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>提示</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             暫存成功！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             確定
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>筆記區</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             儲存並關閉
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>聊天歷史紀錄</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>暫無聊天歷史紀錄</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>創建時間: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             聊天內容:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>無聊天內容</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             關閉
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;




// //成功POST到資料庫
// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and editor content from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('editorData');
//     if (savedData) {
//       setEditorContent(savedData);
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername) {
//       setUsername(savedUsername);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 將編輯器內容發送到後端，後端再提交到 Notion，使用 username 替代 activityTitle
//   const handleSubmit = async () => {
//     try {
//       // 儲存編輯器內容到 localStorage
//       localStorage.setItem('editorData', editorContent);

//       // 向後端發送請求，使用 username 作為 studentName
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true); // 繳交成功後禁用按鈕
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   // 暫存編輯器內容
//   const handleTempSave = () => {
//     localStorage.setItem('editorData', editorContent);
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             寫作精靈
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               筆記區
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 創建新聊天
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 查看聊天歷史
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             <span>
//               {username && `使用者: ${username}`}
//               {activityTitle && ` | 班級: ${activityTitle}`}
//               {groupName && ` | 主題: ${groupName}`}
//             </span>
//             <span>寫作區</span>
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               暫存
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//               disabled={isSubmitDisabled}
//             >
//               繳交上傳
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>提醒</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請先與寫作精靈討論再開始寫作！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             我知道了!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>提示</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             暫存成功！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             確定
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>筆記區</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             儲存並關閉
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>聊天歷史紀錄</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>暫無聊天歷史紀錄</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>創建時間: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             聊天內容:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>無聊天內容</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             關閉
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;




// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and editor content from localStorage on mount
//   useEffect(() => {
//     const savedData = localStorage.getItem('editorData');
//     if (savedData) {
//       setEditorContent(savedData);
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername) {
//       setUsername(savedUsername);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 將編輯器內容發送到後端，後端再提交到 Notion，使用 username 替代 activityTitle
//   const handleSubmit = async () => {
//     try {
//       // 儲存編輯器內容到 localStorage
//       localStorage.setItem('editorData', editorContent);

//       // 向後端發送請求，使用 username 作為 studentName，activityTitle 作為 className
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//         className: activityTitle || '未指定班級',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true); // 繳交成功後禁用按鈕
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   // 暫存編輯器內容
//   const handleTempSave = () => {
//     localStorage.setItem('editorData', editorContent);
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             寫作精靈
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               筆記區
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 創建新聊天
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 查看聊天歷史
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             {/* <span>
//               {username && `使用者: ${username}`}
//               {activityTitle && ` | 班級: ${activityTitle}`}
//               {groupName && ` | 主題: ${groupName}`}
//             </span> */}
//             <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
//              {username && `使用者: ${username}`}
//             {activityTitle && ` | 班級: ${activityTitle}`}
//             {groupName && ` | 主題: ${groupName}`}
//             </span>
//             <span style={{ fontSize: '18px', fontWeight: 'bold' }}>寫作區</span>
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               暫存
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//               disabled={isSubmitDisabled}
//             >
//               繳交上傳
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>提醒</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             請先與寫作精靈討論再開始寫作！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             我知道了!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>提示</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             暫存成功！
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             確定
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>筆記區</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             儲存並關閉
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>聊天歷史紀錄</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>暫無聊天歷史紀錄</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>創建時間: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             聊天內容:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>無聊天內容</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             關閉
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;


//成功版本
// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and fetch essay content from Notion
//   useEffect(() => {
//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername && savedActivityTitle && savedGroupName) {
//       setUsername(savedUsername);

//       // Fetch essay content from Notion based on username, className, and theme
//       const fetchEssayContent = async () => {
//         try {
//           const response = await apiAxios.get(`/api/get-essay/${encodeURIComponent(savedUsername)}`, {
//             params: { className: savedActivityTitle, theme: savedGroupName },
//           });
//           if (response.data.success) {
//             setEditorContent(response.data.data.essayContent || '');
//           } else {
//             console.warn('未找到符合學生姓名、班級和主題的議論文內容，使用空白內容');
//             setEditorContent('');
//           }
//         } catch (error) {
//           console.error('從 Notion 獲取議論文內容失敗:', error);
//           setEditorContent('');
//         }
//       };

//       fetchEssayContent();
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   // 監聽 iframe 發回的消息
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   // 創建新聊天會話
//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         console.log('新創建的 session_id:', newSessionId);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   // 獲取聊天歷史紀錄
//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('後端返回的會話資料:', res.data);

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         if (lastCreatedSessionId) {
//           const sessionExists = updatedHistory.some((session) => session.id === lastCreatedSessionId);
//           console.log(
//             `檢查 session_id ${lastCreatedSessionId} 是否存在於歷史紀錄中: ${sessionExists ? '是' : '否'}`
//           );
//           console.log('更新後的 chatHistory:', updatedHistory);
//         } else {
//           console.log('尚未創建任何會話，無法檢查 session_id');
//         }
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   // 格式化時間
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   // 將編輯器內容發送到後端，後端再提交到 Notion，使用 username 替代 activityTitle
//   const handleSubmit = async () => {
//     try {
//       // 向後端發送請求，使用 username 作為 studentName，activityTitle 作為 className
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//         className: activityTitle || '未指定班級',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true); // 繳交成功後禁用按鈕
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   // 暫存編輯器內容（不再使用 localStorage）
//   const handleTempSave = () => {
//     setOpenTempSaveDialog(true);
//   };

//   // Froala 編輯器選項
//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   // 關閉提醒視窗
//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   // 關閉暫存成功視窗
//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   // 打開筆記區視窗
//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   // 關閉筆記區視窗並儲存筆記
//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   // 關閉聊天歷史視窗
//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   // 處理筆記內容變化
//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             flex: 1,
//             padding: '5px',
//             borderRight: '1px solid #ccc',
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             AI Writing Assistant
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: '14px',
//                 padding: '2px 8px',
//               }}
//             >
//               Notes Area
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 Create New Chat
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 View Chat History
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             flex: 2,
//             padding: '20px',
//             borderLeft: '1px solid #ccc',
//             position: 'relative',
//             height: '500px',
//             marginTop: '-75px',
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//             }}
//           >
//             <Box sx={{ fontSize: '18px', fontWeight: 'bold' }}>
//               <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
//                 {username && `User: ${username}`}
//                 {activityTitle && ` Class: ${activityTitle}`}
//                 {groupName && ` Topic: ${groupName}`}
//               </span>
//             </Box>
//             {/* <span style={{ fontSize: '18px', fontWeight: 'bold' }}>寫作區</span> */}
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               Temporary
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleSubmit}
//               disabled={isSubmitDisabled}
//             >
//               Submit Upload
//             </Button>
//           </Box>
//         </Box>
//       </div>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>Notification</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please discuss with the Writing Assistant before starting to write!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             OK!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>Tip</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Temporary save successful!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: 'none',
//           },
//         }}
//       >
//         <DialogTitle>Notes Area</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             Save and Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//           },
//         }}
//       >
//         <DialogTitle>Chat History</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>No chat history available</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>Creation Time: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             Chat Content:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>No chat content</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;







// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [openConfirmSubmitDialog, setOpenConfirmSubmitDialog] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and fetch essay content from Notion
//   useEffect(() => {
//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername && savedActivityTitle && savedGroupName) {
//       setUsername(savedUsername);

//       const fetchEssayContent = async () => {
//         try {
//           const response = await apiAxios.get(`/api/get-essay/${encodeURIComponent(savedUsername)}`, {
//             params: { className: savedActivityTitle, theme: savedGroupName },
//           });
//           if (response.data.success) {
//             setEditorContent(response.data.data.essayContent || '');
//           } else {
//             console.warn('未找到符合學生姓名、班級和主題的議論文內容，使用空白內容');
//             setEditorContent('');
//           }
//         } catch (error) {
//           console.error('從 Notion 獲取議論文內容失敗:', error);
//           setEditorContent('');
//         }
//       };

//       fetchEssayContent();
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//         className: activityTitle || '未指定班級',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true);
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirmSubmitDialog(false);
//     handleSubmit();
//   };

//   const handleTempSave = () => {
//     setOpenTempSaveDialog(true);
//   };

//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           minHeight: 'calc(100vh - 120px)',
//           padding: '10px',
//           gap: '10px',
//         }}
//       >
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             width: '100%',
//             maxWidth: { xs: '100%', md: '400px' },
//             padding: '5px',
//             borderRight: { md: '1px solid #ccc', xs: 'none' },
//             display: 'flex',
//             flexDirection: 'column',
//             marginTop: '-75px',
//             '@media (max-width: 800px)': {
//               maxWidth: '100%',
//               marginTop: 0,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               position: 'relative',
//             }}
//           >
//             AI Writing Assistant
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 position: 'absolute',
//                 right: '10px',
//                 fontSize: { xs: '12px', md: '14px' }, // 響應式字體大小
//                 padding: { xs: '2px 6px', md: '2px 8px' }, // 響應式內邊距
//                 backgroundColor: '#1976d2', // 藍色背景
//                 color: '#ffffff', // 白色文字
//                 '&:hover': {
//                   backgroundColor: '#1565c0', // 懸停時稍深的藍色
//                 },
//               }}
//             >
//               Notes Area
//             </Button>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             <Box sx={{ mb: 2, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ mb: 1 }}
//               >
//                 Create New Chat
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ mb: 1 }}
//               >
//                 View Chat History
//               </Button>
//             </Box>
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%', minHeight: '500px' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             width: '100%',
//             padding: '20px',
//             borderLeft: { md: '1px solid #ccc', xs: 'none' },
//             position: 'relative',
//             height: '500px',
//             flex: 1,
//             '@media (max-width: 00px)': {
//               padding: '10px',
//               height: 'auto',
//               borderLeft: 'none',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 20px',
//               '@media (max-width: 600px)': {
//                 fontSize: '16px',
//                 height: '40px',
//                 padding: '0 10px',
//               },
//             }}
//           >
//             <Box>
//               <span>
//                 {username && `User: ${username}`}
//                 {activityTitle && ` Class: ${activityTitle}`}
//                 {groupName && ` Topic: ${groupName}`}
//               </span>
//             </Box>
//           </Box>
//           <FroalaEditor
//             tag='textarea'
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />
//           {/* 按鈕容器：移動到寫作區右下方 */}
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//               '@media (max-width: 600px)': {
//                 position: 'relative',
//                 bottom: 0,
//                 right: 0,
//                 width: '100%',
//                 justifyContent: 'center',
//                 marginTop: '10px',
//                 flexWrap: 'wrap', // 小螢幕自動換行
//               },
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               Temporary
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpenConfirmSubmitDialog(true)}
//               disabled={isSubmitDisabled}
//             >
//               Submit Upload
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* 提交確認對話框 */}
//       <Dialog open={openConfirmSubmitDialog} onClose={() => setOpenConfirmSubmitDialog(false)}>
//         <DialogTitle>確認繳交</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要繳交嗎，繳交後無法再修改內容？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmSubmitDialog(false)} color="primary">
//             取消
//           </Button>
//           <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
//             確認
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>Notification</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please discuss with the Writing Assistant before starting to write!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             OK!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>Tip</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Temporary save successful!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               height: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Notes Area</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             Save and Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               maxHeight: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Chat History</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>No chat history available</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>Creation Time: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             Chat Content:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>No chat content</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;




// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [openConfirmSubmitDialog, setOpenConfirmSubmitDialog] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and fetch essay content from Notion
//   useEffect(() => {
//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername && savedActivityTitle && savedGroupName) {
//       setUsername(savedUsername);

//       const fetchEssayContent = async () => {
//         try {
//           const response = await apiAxios.get(`/api/get-essay/${encodeURIComponent(savedUsername)}`, {
//             params: { className: savedActivityTitle, theme: savedGroupName },
//           });
//           if (response.data.success) {
//             setEditorContent(response.data.data.essayContent || '');
//           } else {
//             console.warn('未找到符合學生姓名、班級和主題的議論文內容，使用空白內容');
//             setEditorContent('');
//           }
//         } catch (error) {
//           console.error('從 Notion 獲取議論文內容失敗:', error);
//           setEditorContent('');
//         }
//       };

//       fetchEssayContent();
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//         className: activityTitle || '未指定班級',
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true);
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirmSubmitDialog(false);
//     handleSubmit();
//   };

//   const handleTempSave = () => {
//     setOpenTempSaveDialog(true);
//   };

//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     setOpenNoteDialog(false);
//   };

//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           minHeight: 'calc(100vh - 120px)',
//           padding: '10px',
//           gap: '10px',
//         }}
//       >
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             width: { md: '50%', xs: '100%' },
//             padding: '5px',
//             borderRight: { md: '1px solid #ccc', xs: 'none' },
//             display: 'flex',
//             flexDirection: 'column',
//             height: { md: '600px', sm: '800px', xs: 'auto' },
//             '@media (max-width: 700px)': {
//               height: '800px',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 10px',
//             }}
//           >
//             <span style={{ fontSize:'18px'}}>AI Writing Assistant</span>
//             <Box sx={{ display: 'flex', gap: '5px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ fontSize: '12px', padding: '2px 6px' }}
//               >
//                 Create New Chat
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ fontSize: '12px', padding: '2px 6px' }}
//               >
//                 View Chat History
//               </Button>
//             </Box>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             width: { md: '50%', xs: '100%' },
//             padding: '20px',
//             borderLeft: { md: '1px solid #ccc', xs: 'none' },
//             position: 'relative',
//             height: { md: '600px', sm: '800px', xs: 'auto' },
//             '@media (max-width: 700px)': {
//               width: '100%',
//               padding: '10px',
//               height: '800px',
//               borderLeft: 'none',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 10px',
//             }}
//           >
//             <Box>
//               <span style={{ fontSize:'18px'}}>
//                 {username && `User: ${username}`}
//                 {activityTitle && ` Class: ${activityTitle}`}
//                 {groupName && ` Topic: ${groupName}`}
//               </span>
//             </Box>
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 fontSize: '12px',
//                 padding: '2px 6px',
//                 backgroundColor: '#1976d2',
//                 color: '#ffffff',
//                 '&:hover': {
//                   backgroundColor: '#1565c0',
//                 },
//               }}
//             >
//               Notes Area
//             </Button>
//           </Box>
//           <Box sx={{ height: 'calc(100% - 110px)' }}>
//             <FroalaEditor
//               tag='textarea'
//               config={config}
//               model={editorContent}
//               onModelChange={(newContent) => setEditorContent(newContent)}
//               style={{ height: '100%' }}
//             />
//           </Box>
//           {/* 按鈕容器：移動到寫作區右下方 */}
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//               '@media (max-width: 600px)': {
//                 position: 'relative',
//                 bottom: 0,
//                 right: '0',
//                 width: '100%',
//                 justifyContent: 'center',
//                 marginTop: '10px',
//                 flexWrap: 'wrap',
//               },
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               Temporary
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpenConfirmSubmitDialog(true)}
//               disabled={isSubmitDisabled}
//             >
//               Submit Upload
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* 提交確認對話框 */}
//       <Dialog open={openConfirmSubmitDialog} onClose={() => setOpenConfirmSubmitDialog(false)}>
//         <DialogTitle>確認繳交</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要繳交嗎，繳交後無法再修改內容？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmSubmitDialog(false)} color="primary">
//             取消
//           </Button>
//           <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
//             確認
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>Notification</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please discuss with the Writing Assistant before starting to write!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             OK!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>Tip</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Temporary save successful!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               height: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Notes Area</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             Save and Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               maxHeight: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Chat History</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>No chat history available</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>Creation Time: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             Chat Content:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>No chat content</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;



// import React, { useState, useEffect, useRef } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
// import { Box } from '@mui/system';
// import FroalaEditor from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import axios from 'axios';
// import Navbar from "../components/Navbar_Student";

// // 用於 RAGFlow API 的 axios 實例
// const agentAxios = axios.create({
//   baseURL: 'https://140.115.126.193',
// });

// // 用於與本地後端交互的 axios 實例
// const apiAxios = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// apiAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const WritingArea = () => {
//   const [editorContent, setEditorContent] = useState('');
//   const [openReminderDialog, setOpenReminderDialog] = useState(false);
//   const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
//   const [openNoteDialog, setOpenNoteDialog] = useState(false);
//   const [noteContent, setNoteContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
//   const [sessionResponse, setSessionResponse] = useState('');
//   const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentMessages, setCurrentMessages] = useState([]);
//   const [activityTitle, setActivityTitle] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [username, setUsername] = useState('');
//   const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
//   const [openConfirmSubmitDialog, setOpenConfirmSubmitDialog] = useState(false);
//   const iframeRef = useRef(null);

//   // Load activity title, group name, username, and fetch essay and note content from Notion
//   useEffect(() => {
//     const savedActivityTitle = localStorage.getItem('activityTitle');
//     if (savedActivityTitle) {
//       setActivityTitle(savedActivityTitle);
//     }

//     const savedGroupName = localStorage.getItem('groupName');
//     if (savedGroupName) {
//       setGroupName(savedGroupName);
//     }

//     const savedUsername = localStorage.getItem('name');
//     if (savedUsername && savedActivityTitle && savedGroupName) {
//       setUsername(savedUsername);

//       const fetchEssayContent = async () => {
//         try {
//           const response = await apiAxios.get(`/api/get-essay/${encodeURIComponent(savedUsername)}`, {
//             params: { className: savedActivityTitle, theme: savedGroupName },
//           });
//           if (response.data.success) {
//             setEditorContent(response.data.data.essayContent || '');
//             setNoteContent(response.data.data.noteContent || ''); // 載入筆記區內容
//           } else {
//             console.warn('未找到符合學生姓名、班級和主題的議論文內容，使用空白內容');
//             setEditorContent('');
//             setNoteContent('');
//           }
//         } catch (error) {
//           console.error('從 Notion 獲取議論文內容失敗:', error);
//           setEditorContent('');
//           setNoteContent('');
//         }
//       };

//       fetchEssayContent();
//     }

//     const savedNote = localStorage.getItem('noteData');
//     if (savedNote) {
//       setNoteContent(savedNote);
//     }

//     setOpenReminderDialog(true);
//   }, []);

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.origin !== 'https://140.115.126.193') return;
//       const { type, content } = event.data;
//       if (type === 'agentResponse') {
//         setCurrentMessages((prev) => [
//           ...prev,
//           { role: 'assistant', content, created_at: new Date().toISOString() },
//         ]);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const handleCreateSession = async () => {
//     if (sessionId) {
//       const currentSession = chatHistory.find((session) => session.id === sessionId) || {
//         id: sessionId,
//         created_at: new Date().toISOString(),
//       };
//       setChatHistory([
//         ...chatHistory.filter((session) => session.id !== sessionId),
//         { ...currentSession, messages: currentMessages || [] },
//       ]);
//     }

//     setCurrentMessages([]);

//     try {
//       const res = await agentAxios.post(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {},
//         {
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessionId = res.data.data?.id || '未知 ID';
//         setSessionId(newSessionId);
//         setLastCreatedSessionId(newSessionId);
//         setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
//         if (iframeRef.current) {
//           iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
//         }
//       } else {
//         setSessionResponse(`❌ 創建失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       if (error.message.includes('Token')) {
//         setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
//       } else if (error.message.includes('fetch')) {
//         setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
//       } else {
//         setSessionResponse(`❌ 錯誤：${error.message}`);
//       }
//     }
//   };

//   const handleFetchChatHistory = async () => {
//     try {
//       const res = await agentAxios.get(
//         '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
//         {
//           params: {
//             page: 1,
//             page_size: 100,
//             orderby: 'create_time',
//             desc: true,
//           },
//           headers: {
//             'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.data.code === 0) {
//         const newSessions = res.data.data || [];
//         const updatedHistory = [...chatHistory];
//         newSessions.forEach((session) => {
//           const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
//           if (existingSessionIndex !== -1) {
//             updatedHistory[existingSessionIndex] = {
//               ...updatedHistory[existingSessionIndex],
//               create_time: session.create_time,
//             };
//           } else {
//             updatedHistory.push({ ...session, messages: [] });
//           }
//         });
//         setChatHistory(updatedHistory);
//         setOpenHistoryDialog(true);
//       } else {
//         alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
//       }
//     } catch (error) {
//       alert(`❌ 錯誤：${error.message}`);
//     }
//   };

//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('zh-TW', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await apiAxios.post('/api/submit-to-notion', {
//         studentName: username || '未命名使用者',
//         theme: groupName || '未指定主題',
//         essayContent: editorContent || '無內容',
//         className: activityTitle || '未指定班級',
//         noteContent: noteContent || '', // 包含筆記區內容
//       });

//       if (response.data.success) {
//         alert('繳交上傳成功！');
//         setIsSubmitDisabled(true);
//       } else {
//         alert(`繳交上傳失敗：${response.data.message}`);
//       }
//     } catch (error) {
//       console.error('發送到 Notion 時出錯:', error);
//       const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
//       alert(`繳交上傳失敗：${errorMessage}`);
//     }
//   };

//   const handleConfirmSubmit = () => {
//     setOpenConfirmSubmitDialog(false);
//     handleSubmit();
//   };

//   const handleTempSave = () => {
//     setOpenTempSaveDialog(true);
//   };

//   const handleUpdateNote = async () => {
//     try {
//       const response = await apiAxios.patch('/api/update-note', {
//         studentName: username || '未命名使用者',
//         className: activityTitle || '未指定班級',
//         theme: groupName || '未指定主題',
//         noteContent: noteContent || '',
//       });

//       if (response.data.success) {
//         console.log('筆記區內容已更新到 Notion');
//       } else {
//         console.warn('更新筆記區內容失敗:', response.data.message);
//       }
//     } catch (error) {
//       console.error('更新筆記區內容時出錯:', error);
//     }
//   };

//   const config = {
//     placeholderText: '開始編輯...',
//     charCounterCount: false,
//     toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
//             'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
//             'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
//   };

//   const handleCloseReminderDialog = () => {
//     setOpenReminderDialog(false);
//   };

//   const handleCloseTempSaveDialog = () => {
//     setOpenTempSaveDialog(false);
//   };

//   const handleOpenNoteDialog = () => {
//     setOpenNoteDialog(true);
//   };

//   const handleCloseNoteDialog = () => {
//     localStorage.setItem('noteData', noteContent);
//     handleUpdateNote(); // 儲存筆記時更新 Notion
//     setOpenNoteDialog(false);
//   };

//   const handleCloseHistoryDialog = () => {
//     setOpenHistoryDialog(false);
//   };

//   const handleNoteChange = (e) => {
//     setNoteContent(e.target.value);
//   };

//   return (
//     <div>
//       <Navbar />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           minHeight: 'calc(100vh - 120px)',
//           padding: '10px',
//           gap: '10px',
//         }}
//       >
//         {/* 左邊容器：聊天室 */}
//         <Box
//           sx={{
//             width: { md: '50%', xs: '100%' },
//             padding: '5px',
//             borderRight: { md: '1px solid #ccc', xs: 'none' },
//             display: 'flex',
//             flexDirection: 'column',
//             height: { md: '600px', sm: '800px', xs: 'auto' },
//             '@media (max-width: 700px)': {
//               height: '800px',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 10px',
//             }}
//           >
//             <span style={{ fontSize:'18px'}}>AI Writing Assistant</span>
//             <Box sx={{ display: 'flex', gap: '5px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleCreateSession}
//                 sx={{ fontSize: '12px', padding: '2px 6px' }}
//               >
//                 Create New Chat
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleFetchChatHistory}
//                 sx={{ fontSize: '12px', padding: '2px 6px' }}
//               >
//                 View Chat History
//               </Button>
//             </Box>
//           </Box>
//           <div
//             style={{
//               border: '2px solid black',
//               borderRadius: '8px',
//               padding: '10px',
//               flex: 1,
//               overflowY: 'auto',
//               backgroundColor: '#FFFFFF',
//               marginBottom: '10px',
//             }}
//           >
//             {sessionResponse && (
//               <Box
//                 sx={{
//                   mt: 1,
//                   p: 1,
//                   backgroundColor: '#f0f0f0',
//                   borderRadius: '4px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {sessionResponse}
//               </Box>
//             )}
//             <iframe
//               ref={iframeRef}
//               src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
//               style={{ width: '100%', height: '100%' }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </Box>

//         {/* 右邊容器：文字編輯器 */}
//         <Box
//           sx={{
//             width: { md: '50%', xs: '100%' },
//             padding: '20px',
//             borderLeft: { md: '1px solid #ccc', xs: 'none' },
//             position: 'relative',
//             height: { md: '600px', sm: '800px', xs: 'auto' },
//             '@media (max-width: 700px)': {
//               width: '100%',
//               padding: '10px',
//               height: '800px',
//               borderLeft: 'none',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '100%',
//               height: '50px',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               backgroundColor: '#B7C5FF',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               padding: '0 10px',
//             }}
//           >
//             <Box>
//               <span style={{ fontSize:'18px'}}>
//                 {username && `User: ${username}`}
//                 {activityTitle && ` Class: ${activityTitle}`}
//                 {groupName && ` Topic: ${groupName}`}
//               </span>
//             </Box>
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleOpenNoteDialog}
//               sx={{
//                 fontSize: '12px',
//                 padding: '2px 6px',
//                 backgroundColor: '#1976d2',
//                 color: '#ffffff',
//                 '&:hover': {
//                   backgroundColor: '#1565c0',
//                 },
//               }}
//             >
//               Notes Area
//             </Button>
//           </Box>
//           <Box sx={{ height: 'calc(100% - 110px)' }}>
//             <FroalaEditor
//               tag='textarea'
//               config={config}
//               model={editorContent}
//               onModelChange={(newContent) => setEditorContent(newContent)}
//               style={{ height: '100%' }}
//             />
//           </Box>
//           {/* 按鈕容器：移動到寫作區右下方 */}
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: '20px',
//               right: '20px',
//               display: 'flex',
//               gap: '10px',
//               zIndex: 10,
//               '@media (max-width: 600px)': {
//                 position: 'relative',
//                 bottom: 0,
//                 right: '0',
//                 width: '100%',
//                 justifyContent: 'center',
//                 marginTop: '10px',
//                 flexWrap: 'wrap',
//               },
//             }}
//           >
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleTempSave}
//             >
//               Temporary
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => setOpenConfirmSubmitDialog(true)}
//               disabled={isSubmitDisabled}
//             >
//               Submit Upload
//             </Button>
//           </Box>
//         </Box>
//       </Box>

//       {/* 提交確認對話框 */}
//       <Dialog open={openConfirmSubmitDialog} onClose={() => setOpenConfirmSubmitDialog(false)}>
//         <DialogTitle>確認繳交</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             確定要繳交嗎，繳交後無法再修改內容？
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenConfirmSubmitDialog(false)} color="primary">
//             取消
//           </Button>
//           <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
//             確認
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
//         <DialogTitle>Notification</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Please discuss with the Writing Assistant before starting to write!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseReminderDialog} color="primary">
//             OK!
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
//         <DialogTitle>Tip</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Temporary save successful!
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseTempSaveDialog} color="primary">
//             OK
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openNoteDialog}
//         onClose={handleCloseNoteDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             height: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               height: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Notes Area</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="記錄您的筆記"
//             value={noteContent}
//             onChange={handleNoteChange}
//             multiline
//             rows={15}
//             fullWidth
//             variant="outlined"
//             sx={{ height: '90%' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseNoteDialog} color="primary">
//             Save and Close
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openHistoryDialog}
//         onClose={handleCloseHistoryDialog}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '500px',
//             maxHeight: '500px',
//             maxWidth: '90vw',
//             '@media (max-width: 600px)': {
//               width: '90vw',
//               maxHeight: '80vh',
//             },
//           },
//         }}
//       >
//         <DialogTitle>Chat History</DialogTitle>
//         <DialogContent>
//           {chatHistory.length === 0 ? (
//             <DialogContentText>No chat history available</DialogContentText>
//           ) : (
//             <List>
//               {chatHistory.map((session) => (
//                 <ListItem key={session.id}>
//                   <ListItemText
//                     primary={`會話 ID: ${session.id}`}
//                     secondary={
//                       <>
//                         <div>Creation Time: {formatDateTime(session.created_at)}</div>
//                         {session.messages && session.messages.length > 0 ? (
//                           <div>
//                             Chat Content:
//                             <List dense>
//                               {session.messages.map((msg, index) => (
//                                 <ListItem key={index}>
//                                   <ListItemText
//                                     primary={`${msg.role}: ${msg.content}`}
//                                     secondary={`時間: ${formatDateTime(msg.created_at)}`}
//                                   />
//                                 </ListItem>
//                               ))}
//                             </List>
//                           </div>
//                         ) : (
//                           <div>No chat content</div>
//                         )}
//                       </>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseHistoryDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default WritingArea;










import React, { useState, useEffect, useRef } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import axios from 'axios';
import Navbar from "../components/Navbar_Student";

// 用於 RAGFlow API 的 axios 實例
const agentAxios = axios.create({
  baseURL: 'https://140.115.126.193',
});

// 用於與本地後端交互的 axios 實例
const apiAxios = axios.create({
  baseURL: 'http://localhost:4000',
});

apiAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const WritingArea = () => {
  const [editorContent, setEditorContent] = useState('');
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false);
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [lastCreatedSessionId, setLastCreatedSessionId] = useState('');
  const [sessionResponse, setSessionResponse] = useState('');
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [activityTitle, setActivityTitle] = useState('');
  const [groupName, setGroupName] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [openConfirmSubmitDialog, setOpenConfirmSubmitDialog] = useState(false);
  const iframeRef = useRef(null);

  // Load activity title, group name, username, and fetch essay and note content from Notion
  useEffect(() => {
    const savedActivityTitle = localStorage.getItem('activityTitle');
    if (savedActivityTitle) {
      setActivityTitle(savedActivityTitle);
    }

    const savedGroupName = localStorage.getItem('groupName');
    if (savedGroupName) {
      setGroupName(savedGroupName);
    }

    const savedUsername = localStorage.getItem('name');
    if (savedUsername && savedActivityTitle && savedGroupName) {
      setUsername(savedUsername);

      const fetchEssayContent = async () => {
        try {
          const response = await apiAxios.get(`/api/get-essay/${encodeURIComponent(savedUsername)}`, {
            params: { className: savedActivityTitle, theme: savedGroupName },
          });
          if (response.data.success) {
            setEditorContent(response.data.data.essayContent || '');
            setNoteContent(response.data.data.noteContent || ''); // 載入筆記區內容
          } else {
            console.warn('未找到符合學生姓名、班級和主題的議論文內容，使用空白內容');
            setEditorContent('');
            setNoteContent('');
          }
        } catch (error) {
          console.error('從 Notion 獲取議論文內容失敗:', error);
          setEditorContent('');
          setNoteContent('');
        }
      };

      fetchEssayContent();
    }

    const savedNote = localStorage.getItem('noteData');
    if (savedNote) {
      setNoteContent(savedNote);
    }

    setOpenReminderDialog(true);
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'https://140.115.126.193') return;
      const { type, content } = event.data;
      if (type === 'agentResponse') {
        setCurrentMessages((prev) => [
          ...prev,
          { role: 'assistant', content, created_at: new Date().toISOString() },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCreateSession = async () => {
    if (sessionId) {
      const currentSession = chatHistory.find((session) => session.id === sessionId) || {
        id: sessionId,
        created_at: new Date().toISOString(),
      };
      setChatHistory([
        ...chatHistory.filter((session) => session.id !== sessionId),
        { ...currentSession, messages: currentMessages || [] },
      ]);
    }

    setCurrentMessages([]);

    try {
      const res = await agentAxios.post(
        '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
        {},
        {
          headers: {
            'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.code === 0) {
        const newSessionId = res.data.data?.id || '未知 ID';
        setSessionId(newSessionId);
        setLastCreatedSessionId(newSessionId);
        setSessionResponse(`✅ 成功創建聊天會話：${newSessionId}`);
        if (iframeRef.current) {
          iframeRef.current.src = `https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&session_id=${newSessionId}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`;
        }
      } else {
        setSessionResponse(`❌ 創建失敗：${res.data.message}`);
      }
    } catch (error) {
      if (error.message.includes('Token')) {
        setSessionResponse('❌ Token 無效，請重新登錄或聯繫管理員！');
      } else if (error.message.includes('fetch')) {
        setSessionResponse('❌ 網絡錯誤，請檢查伺服器連線或 SSL 證書！');
      } else {
        setSessionResponse(`❌ 錯誤：${error.message}`);
      }
    }
  };

  const handleFetchChatHistory = async () => {
    try {
      const res = await agentAxios.get(
        '/api/v1/agents/8f34f200ef5911ef91480242ac120005/sessions',
        {
          params: {
            page: 1,
            page_size: 100,
            orderby: 'create_time',
            desc: true,
          },
          headers: {
            'Authorization': 'Bearer ragflow-hmY2YzMjRjMWQ5YTExZjBhMGQ5MDI0Mm',
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.code === 0) {
        const newSessions = res.data.data || [];
        const updatedHistory = [...chatHistory];
        newSessions.forEach((session) => {
          const existingSessionIndex = updatedHistory.findIndex((s) => s.id === session.id);
          if (existingSessionIndex !== -1) {
            updatedHistory[existingSessionIndex] = {
              ...updatedHistory[existingSessionIndex],
              create_time: session.create_time,
            };
          } else {
            updatedHistory.push({ ...session, messages: [] });
          }
        });
        setChatHistory(updatedHistory);
        setOpenHistoryDialog(true);
      } else {
        alert(`❌ 獲取聊天歷史失敗：${res.data.message}`);
      }
    } catch (error) {
      alert(`❌ 錯誤：${error.message}`);
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiAxios.post('/api/submit-to-notion', {
        studentName: username || '未命名使用者',
        theme: groupName || '未指定主題',
        essayContent: editorContent || '無內容',
        className: activityTitle || '未指定班級',
        noteContent: noteContent || '', // 包含筆記區內容
      });

      if (response.data.success) {
        alert('繳交上傳成功！');
        setIsSubmitDisabled(true);
      } else {
        alert(`繳交上傳失敗：${response.data.message}`);
      }
    } catch (error) {
      console.error('發送到 Notion 時出錯:', error);
      const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
      alert(`繳交上傳失敗：${errorMessage}`);
    }
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmSubmitDialog(false);
    handleSubmit();
  };

  const handleTempSave = () => {
    setOpenTempSaveDialog(true);
  };

  const handleUpdateNote = async () => {
    try {
      const response = await apiAxios.patch('/api/update-note', {
        studentName: username || '未命名使用者',
        className: activityTitle || '未指定班級',
        theme: groupName || '未指定主題',
        noteContent: noteContent || '',
        essayContent: editorContent || '', // 包含寫作區內容
      });

      if (response.data.success) {
        console.log('筆記區和寫作區內容已更新到 Notion');
      } else {
        console.warn('更新筆記區和寫作區內容失敗:', response.data.message);
      }
    } catch (error) {
      console.error('更新筆記區和寫作區內容時出錯:', error);
    }
  };

  const config = {
    placeholderText: '開始編輯...',
    charCounterCount: false,
    toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'color', 'fontFamily', 'backColor',
            'align', 'orderedList', 'unorderedList', 'insertImage', 'insertTable', 'link', 'undo', 'redo', 
            'clearFormatting', 'fullscreen', 'html', 'insertHR', 'specialCharacters'],
  };

  const handleCloseReminderDialog = () => {
    setOpenReminderDialog(false);
  };

  const handleCloseTempSaveDialog = () => {
    setOpenTempSaveDialog(false);
  };

  const handleOpenNoteDialog = () => {
    setOpenNoteDialog(true);
  };

  const handleCloseNoteDialog = () => {
    localStorage.setItem('noteData', noteContent);
    handleUpdateNote(); // 儲存筆記時更新 Notion，包含寫作區和筆記區內容
    setOpenNoteDialog(false);
  };

  const handleCloseHistoryDialog = () => {
    setOpenHistoryDialog(false);
  };

  const handleNoteChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: 'calc(100vh - 120px)',
          padding: '10px',
          gap: '10px',
        }}
      >
        {/* 左邊容器：聊天室 */}
        <Box
          sx={{
            width: { md: '50%', xs: '100%' },
            padding: '5px',
            borderRight: { md: '1px solid #ccc', xs: 'none' },
            display: 'flex',
            flexDirection: 'column',
            height: { md: '600px', sm: '800px', xs: 'auto' },
            '@media (max-width: 700px)': {
              height: '800px',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#B7C5FF',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '0 10px',
            }}
          >
            <span style={{ fontSize:'18px'}}>AI Writing Assistant</span>
            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateSession}
                sx={{ fontSize: '12px', padding: '2px 6px' }}
              >
                Create New Chat
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFetchChatHistory}
                sx={{ fontSize: '12px', padding: '2px 6px' }}
              >
                View Chat History
              </Button>
            </Box>
          </Box>
          <div
            style={{
              border: '2px solid black',
              borderRadius: '8px',
              padding: '10px',
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            {sessionResponse && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {sessionResponse}
              </Box>
            )}
            <iframe
              ref={iframeRef}
              src={`https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005${sessionId ? `&session_id=${sessionId}` : ''}&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm`}
              style={{ width: '100%', height: '100%' }}
              frameBorder="0"
              title="Chat Widget"
            />
          </div>
        </Box>

        {/* 右邊容器：文字編輯器 */}
        <Box
          sx={{
            width: { md: '50%', xs: '100%' },
            padding: '20px',
            borderLeft: { md: '1px solid #ccc', xs: 'none' },
            position: 'relative',
            height: { md: '600px', sm: '800px', xs: 'auto' },
            '@media (max-width: 700px)': {
              width: '100%',
              padding: '10px',
              height: '800px',
              borderLeft: 'none',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#B7C5FF',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '0 10px',
            }}
          >
            <Box>
              <span style={{ fontSize:'18px'}}>
                {username && `User: ${username}`}
                {activityTitle && ` Class: ${activityTitle}`}
                {groupName && ` Topic: ${groupName}`}
              </span>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenNoteDialog}
              sx={{
                fontSize: '12px',
                padding: '2px 6px',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Notes Area
            </Button>
          </Box>
          <Box sx={{ height: 'calc(100% - 110px)' }}>
            <FroalaEditor
              tag='textarea'
              config={config}
              model={editorContent}
              onModelChange={(newContent) => setEditorContent(newContent)}
              style={{ height: '100%' }}
            />
          </Box>
          {/* 按鈕容器：移動到寫作區右下方 */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              gap: '10px',
              zIndex: 10,
              '@media (max-width: 600px)': {
                position: 'relative',
                bottom: 0,
                right: '0',
                width: '100%',
                justifyContent: 'center',
                marginTop: '10px',
                flexWrap: 'wrap',
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleTempSave}
            >
              Temporary
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenConfirmSubmitDialog(true)}
              disabled={isSubmitDisabled}
            >
              Submit Upload
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 提交確認對話框 */}
      <Dialog open={openConfirmSubmitDialog} onClose={() => setOpenConfirmSubmitDialog(false)}>
        <DialogTitle>確認繳交</DialogTitle>
        <DialogContent>
          <DialogContentText>
            確定要繳交嗎，繳交後無法再修改內容？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmSubmitDialog(false)} color="primary">
            取消
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            確認
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openReminderDialog} onClose={handleCloseReminderDialog}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please discuss with the Writing Assistant before starting to write!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReminderDialog} color="primary">
            OK!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
        <DialogTitle>Tip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Temporary save successful!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTempSaveDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNoteDialog}
        onClose={handleCloseNoteDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            height: '500px',
            maxWidth: '90vw',
            '@media (max-width: 600px)': {
              width: '90vw',
              height: '80vh',
            },
          },
        }}
      >
        <DialogTitle>Notes Area</DialogTitle>
        <DialogContent>
          <TextField
            label="記錄您的筆記"
            value={noteContent}
            onChange={handleNoteChange}
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            sx={{ height: '90%' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoteDialog} color="primary">
            Save and Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openHistoryDialog}
        onClose={handleCloseHistoryDialog}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            maxHeight: '500px',
            maxWidth: '90vw',
            '@media (max-width: 600px)': {
              width: '90vw',
              maxHeight: '80vh',
            },
          },
        }}
      >
        <DialogTitle>Chat History</DialogTitle>
        <DialogContent>
          {chatHistory.length === 0 ? (
            <DialogContentText>No chat history available</DialogContentText>
          ) : (
            <List>
              {chatHistory.map((session) => (
                <ListItem key={session.id}>
                  <ListItemText
                    primary={`會話 ID: ${session.id}`}
                    secondary={
                      <>
                        <div>Creation Time: {formatDateTime(session.created_at)}</div>
                        {session.messages && session.messages.length > 0 ? (
                          <div>
                            Chat Content:
                            <List dense>
                              {session.messages.map((msg, index) => (
                                <ListItem key={index}>
                                  <ListItemText
                                    primary={`${msg.role}: ${msg.content}`}
                                    secondary={`時間: ${formatDateTime(msg.created_at)}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </div>
                        ) : (
                          <div>No chat content</div>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WritingArea;