// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Box,
//   TextField,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Paper,
// } from "@mui/material";
// import FroalaEditor from "react-froala-wysiwyg";
// import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/css/froala_editor.pkgd.min.css";
// import "froala-editor/css/froala_style.min.css";
// import Navbar from "../components/Navbar_Teacher";
// import { styled } from "@mui/system";

// // 自定義樣式
// const MainContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   height: "calc(100vh - 64px)", // 減去 Navbar 高度
//   [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
//     flexDirection: "column",
//     height: "auto",
//   },
// }));

// const LeftBox = styled(Box)(({ theme }) => ({
//   flex: 1,
//   padding: "5px",
//   borderRight: "1px solid #ccc",
//   display: "flex",
//   flexDirection: "column",
//   marginTop: "-75px",
//   [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
//     marginTop: 0,
//     borderRight: "none",
//     borderBottom: "1px solid #ccc",
//     height: "50vh",
//   },
// }));

// const RightBox = styled(Box)(({ theme }) => ({
//   flex: 2,
//   padding: "20px",
//   borderLeft: "1px solid #ccc",
//   position: "relative",
//   marginTop: "-75px",
//   display: "flex",
//   flexDirection: "column",
//   [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
//     marginTop: 0,
//     borderLeft: "none",
//     height: "auto",
//   },
// }));

// const TitleBox = styled(Box)(({ theme }) => ({
//   width: "100%",
//   height: "50px",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: "#B7C5FF",
//   fontSize: "18px",
//   fontWeight: "bold",
// }));

// const CommentPaper = styled(Paper)(({ theme }) => ({
//   marginTop: "20px",
//   padding: "16px",
//   backgroundColor: "#FFFFFF",
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     marginTop: "10px",
//     padding: "12px",
//   },
// }));

// const CommentTextField = styled(TextField)(({ theme }) => ({
//   width: "100%",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     marginBottom: "10px",
//   },
// }));

// const RatingContainer = styled(Box)(({ theme }) => ({
//   marginTop: "20px",
//   display: "flex",
//   flexDirection: "column", // 改為垂直排列
//   gap: "15px", // 每個欄位之間的間距
//   alignItems: "flex-start",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     gap: "10px",
//   },
// }));

// const ButtonContainer = styled(Box)(({ theme }) => ({
//   marginTop: "20px",
//   display: "flex",
//   gap: "10px",
//   justifyContent: "flex-end",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     justifyContent: "center",
//   },
// }));

// const ScoreDisplay = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     gap: "5px",
//   },
// }));

// const ScoreLabel = styled(Typography)(({ theme }) => ({
//   fontSize: "16px",
//   fontWeight: "bold",
//   color: "#1976d2",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "14px",
//   },
// }));

// const ScoreInput = styled(TextField)(({ theme }) => ({
//   width: "60px",
//   "& input": {
//     textAlign: "center",
//   },
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     width: "50px",
//   },
// }));

// const CorrectEssays = () => {
//   const [editorContent, setEditorContent] = useState(""); // 儲存 Froala 編輯器內容
//   const [comment, setComment] = useState(""); // 儲存評語
//   const [ratings, setRatings] = useState({
//     claims: 0,
//     grounds: 0,
//     rebuttals: 0,
//   }); // 儲存評分
//   const [totalScore, setTotalScore] = useState(0); // 儲存總分

//   // 評分選項和描述
//   const ratingOptions = {
//     claims: [
//       { value: 0, label: "0", description: "" },
//       { value: 1, label: "1: 弱的主張，文章無法提出有效的論點", description: "弱的主張，文章無法提出有效的論點" },
//       { value: 2, label: "2: 強的主張，文章能提出有效的論點", description: "強的主張，文章能提出有效的論點" },
//     ],
//     grounds: [
//       { value: 0, label: "0", description: "" },
//       { value: 1, label: "1: 證據不足，無法提出有效的佐證資料", description: "證據不足，無法提出有效的佐證資料" },
//       { value: 2, label: "2: 主觀個人意見，佐證資料屬於主觀的個人意見", description: "主觀個人意見，佐證資料屬於主觀的個人意見" },
//       { value: 3, label: "3: 客觀外部資料，佐證資料來自於客觀的外部資料", description: "客觀外部資料，佐證資料來自於客觀的外部資料" },
//       {
//         value: 4,
//         label: "4: 包含客觀的外部資料及主觀的個人意見，佐證資料包含了客觀的外部資料及主觀的個人意見，充分支持論點",
//         description: "包含客觀的外部資料及主觀的個人意見，佐證資料包含了客觀的外部資料及主觀的個人意見，充分支持論點",
//       },
//     ],
//     rebuttals: [
//       { value: 0, label: "0", description: "" },
//       { value: 1, label: "1: 弱的反駁論點，僅包含了自己的論點", description: "弱的反駁論點，僅包含了自己的論點" },
//       { value: 2, label: "2: 強有力的反駁論點，包含了反方的論點及反駁論點", description: "強有力的反駁論點，包含了反方的論點及反駁論點" },
//     ],
//   };

//   // 初始化時載入儲存的內容
//   useEffect(() => {
//     const savedEditorData = localStorage.getItem("editorData");
//     if (savedEditorData) {
//       setEditorContent(savedEditorData);
//     }

//     const savedComment = localStorage.getItem("comment");
//     if (savedComment) {
//       setComment(savedComment);
//     }

//     const savedRatings = localStorage.getItem("ratings");
//     if (savedRatings) {
//       const parsedRatings = JSON.parse(savedRatings);
//       setRatings(parsedRatings);
//       // 計算初始總分
//       setTotalScore(
//         parsedRatings.claims + parsedRatings.grounds + parsedRatings.rebuttals
//       );
//     }

//     const savedTotalScore = localStorage.getItem("totalScore");
//     if (savedTotalScore) {
//       setTotalScore(parseInt(savedTotalScore, 10));
//     }
//   }, []);

//   // 當評分改變時，自動計算總分
//   useEffect(() => {
//     const total = ratings.claims + ratings.grounds + ratings.rebuttals;
//     setTotalScore(total);
//   }, [ratings]);

//   // 設置 Froala 編輯器選項
//   const config = {
//     placeholderText: "開始編輯...",
//     charCounterCount: false,
//     toolbarButtons: [
//       "bold",
//       "italic",
//       "underline",
//       "strikeThrough",
//       "fontSize",
//       "color",
//       "fontFamily",
//       "backColor",
//       "align",
//       "orderedList",
//       "unorderedList",
//       "insertImage",
//       "insertTable",
//       "link",
//       "undo",
//       "redo",
//       "clearFormatting",
//       "fullscreen",
//       "html",
//       "insertHR",
//       "specialCharacters",
//     ],
//   };

//   // 處理評語輸入
//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   // 處理評分選擇
//   const handleRatingChange = (category) => (e) => {
//     setRatings((prev) => ({
//       ...prev,
//       [category]: e.target.value,
//     }));
//   };

//   // 處理總分手動修改
//   const handleTotalScoreChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     if (!isNaN(value) && value >= 0 && value <= 8) {
//       setTotalScore(value);
//     }
//   };

//   // 儲存編輯器內容、評語、評分和總分
//   const handleSave = () => {
//     localStorage.setItem("editorData", editorContent);
//     localStorage.setItem("comment", comment);
//     localStorage.setItem("ratings", JSON.stringify(ratings));
//     localStorage.setItem("totalScore", totalScore.toString());
//     alert("儲存成功!");
//   };

//   // 模擬送出（可改為後端 API）
//   const handleSubmit = () => {
//     alert(
//       "送出成功！\n評語: " +
//         comment +
//         "\n評分: " +
//         JSON.stringify(ratings) +
//         "\n總分: " +
//         totalScore
//     );
//     // 這裡可以添加後端 API 請求
//   };

//   return (
//     <div>
//       <Navbar />

//       {/* 主內容區域 */}
//       <MainContainer>
//         {/* 左邊容器：寫作精靈 */}
//         <LeftBox>
//           <TitleBox>寫作精靈</TitleBox>
//           <div
//             style={{
//               border: "2px solid black",
//               borderRadius: "8px",
//               padding: "10px",
//               flex: 1,
//               overflowY: "auto",
//               backgroundColor: "#FFFFFF",
//               marginBottom: "10px",
//             }}
//           >
//             <iframe
//               src="https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&from=agent&auth=JkZGFjM2JjZjAwMDExZWY4ZTkxMDI0Mm"
//               style={{ width: "100%", height: "100%", minHeight: "600px" }}
//               frameBorder="0"
//               title="Chat Widget"
//             />
//           </div>
//         </LeftBox>

//         {/* 右邊容器：寫作區 */}
//         <RightBox>
//           <TitleBox>寫作區</TitleBox>
//           <FroalaEditor
//             tag="textarea"
//             config={config}
//             model={editorContent}
//             onModelChange={(newContent) => setEditorContent(newContent)}
//           />

//           {/* 評語區域 */}
//           <CommentPaper>
//             <CommentTextField
//               label="評語"
//               value={comment}
//               onChange={handleCommentChange}
//               multiline
//               rows={4}
//               variant="outlined"
//             />

//             {/* 評分表 */}
//             <RatingContainer>
//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Claims</InputLabel>
//                 <Select
//                   value={ratings.claims}
//                   onChange={handleRatingChange("claims")}
//                   label="Claims"
//                 >
//                   {ratingOptions.claims.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Grounds</InputLabel>
//                 <Select
//                   value={ratings.grounds}
//                   onChange={handleRatingChange("grounds")}
//                   label="Grounds"
//                 >
//                   {ratingOptions.grounds.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Rebuttals</InputLabel>
//                 <Select
//                   value={ratings.rebuttals}
//                   onChange={handleRatingChange("rebuttals")}
//                   label="Rebuttals"
//                 >
//                   {ratingOptions.rebuttals.map((option) => (
//                     <MenuItem key={option.value} value={option.value}>
//                       {option.label}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               {/* 顯示總分並允許手動修改 */}
//               <ScoreDisplay>
//                 <ScoreLabel>分數</ScoreLabel>
//                 <ScoreInput
//                   type="number"
//                   value={totalScore}
//                   onChange={handleTotalScoreChange}
//                   inputProps={{ min: 0, max: 8 }}
//                   variant="outlined"
//                 />
//               </ScoreDisplay>
//             </RatingContainer>
//           </CommentPaper>

//           {/* 儲存和送出按鈕 */}
//           <ButtonContainer>
//             <Button variant="contained" color="primary" onClick={handleSave}>
//               儲存
//             </Button>
//             <Button variant="contained" color="secondary" onClick={handleSubmit}>
//               送出
//             </Button>
//           </ButtonContainer>
//         </RightBox>
//       </MainContainer>
//     </div>
//   );
// };

// export default CorrectEssays;




import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import Navbar from "../components/Navbar_Teacher";
import { styled } from "@mui/system";

// 自定義樣式
const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "calc(100vh - 64px)", // 減去 Navbar 高度
  [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
    flexDirection: "column",
    height: "auto",
  },
}));

const LeftBox = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: "5px",
  borderRight: "1px solid #ccc",
  display: "flex",
  flexDirection: "column",
  marginTop: "-75px",
  [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
    marginTop: 0,
    borderRight: "none",
    borderBottom: "1px solid #ccc",
    height: "50vh",
  },
}));

const RightBox = styled(Box)(({ theme }) => ({
  flex: 2,
  padding: "20px",
  borderLeft: "1px solid #ccc",
  position: "relative",
  marginTop: "-75px",
  display: "flex",
  flexDirection: "column",
  [theme?.breakpoints?.down("md") || "@media (max-width: 960px)"]: {
    marginTop: 0,
    borderLeft: "none",
    height: "auto",
  },
}));

const TitleBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#B7C5FF",
  fontSize: "18px",
  fontWeight: "bold",
}));

const CommentPaper = styled(Paper)(({ theme }) => ({
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    marginTop: "10px",
    padding: "12px",
  },
}));

const CommentTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    marginBottom: "10px",
  },
}));

const RatingContainer = styled(Box)(({ theme }) => ({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column", // 改為垂直排列
  gap: "15px", // 每個欄位之間的間距
  alignItems: "flex-start",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    gap: "10px",
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: "20px",
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    justifyContent: "center",
  },
}));

const ScoreDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    gap: "5px",
  },
}));

const ScoreLabel = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1976d2",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "14px",
  },
}));

const ScoreInput = styled(TextField)(({ theme }) => ({
  width: "60px",
  "& input": {
    textAlign: "center",
  },
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    width: "50px",
  },
}));

const CorrectEssays = () => {
  const [editorContent, setEditorContent] = useState(""); // 儲存 Froala 編輯器內容
  const [comment, setComment] = useState(""); // 儲存評語
  const [ratings, setRatings] = useState({
    claims: 0,
    grounds: 0,
    rebuttals: 0,
  }); // 儲存評分
  const [totalScore, setTotalScore] = useState(0); // 儲存總分
  const [openTempSaveDialog, setOpenTempSaveDialog] = useState(false); // 控制暫存成功彈窗

  // 評分選項和描述
  const ratingOptions = {
    claims: [
      { value: 0, label: "0", description: "" },
      { value: 1, label: "1: 弱的主張，文章無法提出有效的論點", description: "弱的主張，文章無法提出有效的論點" },
      { value: 2, label: "2: 強的主張，文章能提出有效的論點", description: "強的主張，文章能提出有效的論點" },
    ],
    grounds: [
      { value: 0, label: "0", description: "" },
      { value: 1, label: "1: 證據不足，無法提出有效的佐證資料", description: "證據不足，無法提出有效的佐證資料" },
      { value: 2, label: "2: 主觀個人意見，佐證資料屬於主觀的個人意見", description: "主觀個人意見，佐證資料屬於主觀的個人意見" },
      { value: 3, label: "3: 客觀外部資料，佐證資料來自於客觀的外部資料", description: "客觀外部資料，佐證資料來自於客觀的外部資料" },
      {
        value: 4,
        label: "4: 包含客觀的外部資料及主觀的個人意見，佐證資料包含了客觀的外部資料及主觀的個人意見，充分支持論點",
        description: "包含客觀的外部資料及主觀的個人意見，佐證資料包含了客觀的外部資料及主觀的個人意見，充分支持論點",
      },
    ],
    rebuttals: [
      { value: 0, label: "0", description: "" },
      { value: 1, label: "1: 弱的反駁論點，僅包含了自己的論點", description: "弱的反駁論點，僅包含了自己的論點" },
      { value: 2, label: "2: 強有力的反駁論點，包含了反方的論點及反駁論點", description: "強有力的反駁論點，包含了反方的論點及反駁論點" },
    ],
  };

  // 初始化時載入儲存的內容
  useEffect(() => {
    const savedEditorData = localStorage.getItem("editorData");
    if (savedEditorData) {
      setEditorContent(savedEditorData);
    }

    const savedComment = localStorage.getItem("comment");
    if (savedComment) {
      setComment(savedComment);
    }

    const savedRatings = localStorage.getItem("ratings");
    if (savedRatings) {
      const parsedRatings = JSON.parse(savedRatings);
      setRatings(parsedRatings);
      // 計算初始總分
      setTotalScore(
        parsedRatings.claims + parsedRatings.grounds + parsedRatings.rebuttals
      );
    }

    const savedTotalScore = localStorage.getItem("totalScore");
    if (savedTotalScore) {
      setTotalScore(parseInt(savedTotalScore, 10));
    }
  }, []);

  // 當評分改變時，自動計算總分
  useEffect(() => {
    const total = ratings.claims + ratings.grounds + ratings.rebuttals;
    setTotalScore(total);
  }, [ratings]);

  // 設置 Froala 編輯器選項
  const config = {
    placeholderText: "開始編輯...",
    charCounterCount: false,
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "fontSize",
      "color",
      "fontFamily",
      "backColor",
      "align",
      "orderedList",
      "unorderedList",
      "insertImage",
      "insertTable",
      "link",
      "undo",
      "redo",
      "clearFormatting",
      "fullscreen",
      "html",
      "insertHR",
      "specialCharacters",
    ],
  };

  // 處理評語輸入
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // 處理評分選擇
  const handleRatingChange = (category) => (e) => {
    setRatings((prev) => ({
      ...prev,
      [category]: e.target.value,
    }));
  };

  // 處理總分手動修改
  const handleTotalScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 8) {
      setTotalScore(value);
    }
  };

  // 儲存編輯器內容、評語、評分和總分
  const handleSave = () => {
    localStorage.setItem("editorData", editorContent);
    localStorage.setItem("comment", comment);
    localStorage.setItem("ratings", JSON.stringify(ratings));
    localStorage.setItem("totalScore", totalScore.toString());
    alert("儲存成功!");
  };

  // 暫存編輯器內容、評語、評分和總分，並顯示彈窗
  const handleTempSave = () => {
    localStorage.setItem("editorData", editorContent);
    localStorage.setItem("comment", comment);
    localStorage.setItem("ratings", JSON.stringify(ratings));
    localStorage.setItem("totalScore", totalScore.toString());
    setOpenTempSaveDialog(true); // 顯示暫存成功彈窗
  };

  // 關閉暫存成功彈窗
  const handleCloseTempSaveDialog = () => {
    setOpenTempSaveDialog(false);
  };

  // 模擬送出（可改為後端 API）
  const handleSubmit = () => {
    alert(
      "送出成功！\n評語: " +
        comment +
        "\n評分: " +
        JSON.stringify(ratings) +
        "\n總分: " +
        totalScore
    );
    // 這裡可以添加後端 API 請求
  };

  return (
    <div>
      <Navbar />

      {/* 主內容區域 */}
      <MainContainer>
        {/* 左邊容器：寫作精靈 */}
        <LeftBox>
          <TitleBox>寫作精靈</TitleBox>
          <div
            style={{
              border: "2px solid black",
              borderRadius: "8px",
              padding: "10px",
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#FFFFFF", // 修正拼寫錯誤
              marginBottom: "10px",
            }}
          >
            <iframe
              src="https://140.115.126.193/chat/share?shared_id=8f34f200ef5911ef91480242ac120005&from=agent&auth=hmY2Y0MjNjMWQ5YTExZjBhMGQ5MDI0Mm"
              style={{ width: "100%", height: "100%", minHeight: "600px" }}
              frameBorder="0"
              title="Chat Widget"
            />
          </div>
        </LeftBox>

        {/* 右邊容器：寫作區 */}
        <RightBox>
          <TitleBox>寫作區</TitleBox>
          <FroalaEditor
            tag="textarea"
            config={config}
            model={editorContent}
            onModelChange={(newContent) => setEditorContent(newContent)}
          />

          {/* 評語區域 */}
          <CommentPaper>
            <CommentTextField
              label="評語"
              value={comment}
              onChange={handleCommentChange}
              multiline
              rows={4}
              variant="outlined"
            />

            {/* 評分表 */}
            <RatingContainer>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Claims</InputLabel>
                <Select
                  value={ratings.claims}
                  onChange={handleRatingChange("claims")}
                  label="Claims"
                >
                  {ratingOptions.claims.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Grounds</InputLabel>
                <Select
                  value={ratings.grounds}
                  onChange={handleRatingChange("grounds")}
                  label="Grounds"
                >
                  {ratingOptions.grounds.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Rebuttals</InputLabel>
                <Select
                  value={ratings.rebuttals}
                  onChange={handleRatingChange("rebuttals")}
                  label="Rebuttals"
                >
                  {ratingOptions.rebuttals.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 顯示總分並允許手動修改 */}
              <ScoreDisplay>
                <ScoreLabel>分數</ScoreLabel>
                <ScoreInput
                  type="number"
                  value={totalScore}
                  onChange={handleTotalScoreChange}
                  inputProps={{ min: 0, max: 8 }}
                  variant="outlined"
                />
              </ScoreDisplay>
            </RatingContainer>
          </CommentPaper>

          {/* 儲存和送出按鈕 */}
          <ButtonContainer>
            {/* 新增暫存按鈕 */}
            <Button variant="contained" color="primary" onClick={handleTempSave}>
              暫存
            </Button>
            {/* <Button variant="contained" color="primary" onClick={handleSave}>
              儲存
            </Button> */}
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              送出
            </Button>
          </ButtonContainer>
        </RightBox>
      </MainContainer>

      {/* 暫存成功彈窗 */}
      <Dialog open={openTempSaveDialog} onClose={handleCloseTempSaveDialog}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <DialogContentText>暫存成功！</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTempSaveDialog} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CorrectEssays;