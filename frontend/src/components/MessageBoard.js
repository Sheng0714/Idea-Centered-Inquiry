import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar_Teacher";
import { styled } from "@mui/system";
import url from "../url.json";

// 自定義樣式
const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: "20px auto",
  maxWidth: "600px",
  padding: "20px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    margin: "10px",
    padding: "15px",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  marginBottom: "16px",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    marginBottom: "12px",
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#42a5f5",
  color: "white",
  "&:hover": {
    backgroundColor: "#2196f3",
  },
  marginLeft: "auto",
  display: "block",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "14px",
    padding: "6px 12px",
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#e0e0e0",
  color: "#333",
  "&:hover": {
    backgroundColor: "#d5d5d5",
  },
  marginTop: "16px",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "14px",
    padding: "6px 12px",
  },
}));

const MessageBoard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // 儲存輸入的留言
  const [messages, setMessages] = useState([]); // 儲存留言列表

  // 從 localStorage 獲取教師資訊
  const teacherName = localStorage.getItem("name") || "Teacher";
  const role = localStorage.getItem("role");

  // 獲取留言數據（模擬從後端獲取）
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(url.backendHost + "/messages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("獲取留言失敗:", error);
        // 模擬數據（如果後端尚未實現）
        setMessages([
          {
            sender: "Teacher",
            content: "留言範例",
            timestamp: "2025/2/12 13:45",
          },
        ]);
      }
    };
    fetchMessages();
  }, []);

  // 處理留言輸入
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // 處理發送留言
  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("請輸入留言內容");
      return;
    }

    const newMessage = {
      sender: teacherName,
      content: message,
      timestamp: new Date().toLocaleString("zh-TW", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      // 發送留言到後端
      await axios.post(
        url.backendHost + "/messages",
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      // 更新前端顯示
      setMessages([...messages, newMessage]);
      setMessage(""); // 清空輸入框
    } catch (error) {
      console.error("發送留言失敗:", error);
      alert("發送留言失敗，請稍後再試");
    }
  };

  // 處理 Cancel 按鈕
  const handleCancel = () => {
    navigate("/teacher/teacher_home");
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <StyledPaper>
          {/* 標題 */}
          <Typography variant="h6" gutterBottom>
            留言板
          </Typography>

          {/* 留言輸入框 */}
          <StyledTextField
            label="請輸入留言內容..."
            value={message}
            onChange={handleMessageChange}
            multiline
            rows={3}
            variant="outlined"
          />

          {/* 發送按鈕 */}
          <SendButton variant="contained" onClick={handleSendMessage}>
            發送
          </SendButton>

          {/* 留言列表 */}
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${msg.sender}`}
                  secondary={`${msg.content} - ${msg.timestamp}`}
                />
              </ListItem>
            ))}
          </List>

          {/* Cancel 按鈕 */}
          <div style={{ textAlign: "right" }}>
            <CancelButton variant="contained" onClick={handleCancel}>
              Cancel
            </CancelButton>
          </div>
        </StyledPaper>
      </div>
    </div>
  );
};

export default MessageBoard;