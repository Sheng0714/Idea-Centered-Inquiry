
// import React, { useState } from "react";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Checkbox,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom"; // 導入 useNavigate 用於頁面跳轉
// import Navbar from "../components/Navbar_Teacher";
// import { styled } from "@mui/system";

// // 自定義樣式
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   margin: "20px auto",
//   maxWidth: "90%",
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//   borderRadius: "8px",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     maxWidth: "100%",
//     margin: "10px",
//   },
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontSize: "16px",
//   padding: "12px",
//   textAlign: "center",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "14px",
//     padding: "8px",
//   },
// }));

// const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
//   fontWeight: "bold",
//   backgroundColor: "#f5f5f5",
//   color: "#333",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   margin: "10px",
//   backgroundColor: "#e0e0e0",
//   color: "#333",
//   "&:hover": {
//     backgroundColor: "#d5d5d5",
//   },
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "14px",
//     padding: "6px 12px",
//   },
// }));

// const MessageButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "#42a5f5",
//   color: "white",
//   "&:hover": {
//     backgroundColor: "#2196f3",
//   },
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "12px",
//     padding: "4px 8px",
//   },
// }));

// const EssayLink = styled("span")({
//   color: "#1976d2",
//   cursor: "pointer",
//   textDecoration: "underline",
//   "&:hover": {
//     color: "#115293",
//   },
// });

// const Studentlist = () => {
//   const navigate = useNavigate(); // 用於頁面跳轉

//   // 模擬學生數據，包含批改狀態
//   const [students, setStudents] = useState([
//     {
//       group: "是否支持使用核電",
//       name: "SHENG54665746584",
//       // onlineTime: "1h30m",
//       submissionTime: "尚未繳交",
//       essay: "Essay",
//       reviewed: false,
//     },
//     {
//       group: "是否支持使用核電",
//       name: "sheng1",
//       // onlineTime: "3h45m",
//       submissionTime: "尚未繳交",
//       essay: "Essay",
//       reviewed: false,
//     },
//     {
//       group: "TEST",
//       name: "SHENG54665746584",
//       // onlineTime: "2h43m",
//       submissionTime: "尚未繳交",
//       essay: "Essay",
//       reviewed: false,
//     },
//     // {
//     //   group: "G2",
//     //   name: "Alan",
//     //   onlineTime: "5h50m",
//     //   submissionTime: "2025/2/13 8:13",
//     //   essay: "Essay",
//     //   reviewed: true,
//     // },
//   ]);

//   // 處理留言按鈕點擊，跳轉到指定路徑
//   const handleMessageClick = () => {
//     navigate("/MessageBoard");
//   };

//   // 處理批改議論文點擊，跳轉到指定路徑
//   const handleEssayClick = () => {
//     navigate("/CorrectEssays");
//   };

//   // 處理批改勾選框變化
//   const handleReviewChange = (index) => {
//     const updatedStudents = [...students];
//     updatedStudents[index].reviewed = !updatedStudents[index].reviewed; // 切換勾選狀態
//     setStudents(updatedStudents);
//   };

//   // 處理 Cancel 按鈕，跳轉到 /teacher/teacher_home
//   const handleCancel = () => {
//     navigate("/teacher/teacher_home");
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ padding: "20px" }}>
//         {/* 表格 */}
//         <StyledTableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <StyledTableHeadCell>主題</StyledTableHeadCell>
//                 <StyledTableHeadCell>姓名</StyledTableHeadCell>
//                 <StyledTableHeadCell>總上線時間</StyledTableHeadCell>
//                 <StyledTableHeadCell>議論文繳交時間</StyledTableHeadCell>
//                 <StyledTableHeadCell>批改議論文</StyledTableHeadCell>
//                 <StyledTableHeadCell>留言</StyledTableHeadCell>
//                 <StyledTableHeadCell>批改</StyledTableHeadCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => (
//                 <TableRow key={index}>
//                   <StyledTableCell>{student.group}</StyledTableCell>
//                   <StyledTableCell>{student.name}</StyledTableCell>
//                   <StyledTableCell>{student.onlineTime}</StyledTableCell>
//                   <StyledTableCell>{student.submissionTime}</StyledTableCell>
//                   <StyledTableCell>
//                     <EssayLink onClick={handleEssayClick}>
//                       {student.essay}
//                     </EssayLink>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <MessageButton
//                       variant="contained"
//                       onClick={handleMessageClick}
//                     >
//                       留言
//                     </MessageButton>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <Checkbox
//                       checked={student.reviewed}
//                       onChange={() => handleReviewChange(index)}
//                     />
//                   </StyledTableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </StyledTableContainer>

//         {/* Cancel 按鈕 */}
//         <div style={{ textAlign: "right" }}>
//           <StyledButton variant="contained" onClick={handleCancel}>
//             Cancel
//           </StyledButton>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Studentlist;






// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Checkbox,
//   Typography,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar_Teacher";
// import { styled } from "@mui/system";
// import axios from "axios";
// import url from "../url.json";

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   margin: "20px auto",
//   maxWidth: "90%",
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//   borderRadius: "8px",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     maxWidth: "100%",
//     margin: "10px",
//   },
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontSize: "16px",
//   padding: "12px",
//   textAlign: "center",
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "14px",
//     padding: "8px",
//   },
// }));

// const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
//   fontWeight: "bold",
//   backgroundColor: "#f5f5f5",
//   color: "#333",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   margin: "10px",
//   backgroundColor: "#e0e0e0",
//   color: "#333",
//   "&:hover": {
//     backgroundColor: "#d5d5d5",
//   },
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "14px",
//     padding: "6px 12px",
//   },
// }));

// const MessageButton = styled(Button)(({ theme }) => ({
//   backgroundColor: "#42a5f5",
//   color: "white",
//   "&:hover": {
//     backgroundColor: "#2196f3",
//   },
//   [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
//     fontSize: "12px",
//     padding: "4px 8px",
//   },
// }));

// const EssayLink = styled("span")({
//   color: "#1976d2",
//   cursor: "pointer",
//   textDecoration: "underline",
//   "&:hover": {
//     color: "#115293",
//   },
// });

// const Studentlist = () => {
//   const navigate = useNavigate();
//   const [className, setClassName] = useState("載入中...");
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     const activityId = localStorage.getItem("activityId");
//     console.log("Current activityId in Studentlist:", activityId);
//     if (!activityId) {
//       setClassName("無效活動");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const baseUrl = url.backendHost.endsWith("/") ? url.backendHost.slice(0, -1) : url.backendHost;
//         const response = await axios.get(`${baseUrl}/api/activities/${activityId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
//             'Cache-Control': 'no-cache', // 避免緩存
//           },
//         });
//         console.log("Fetched activity data in Studentlist:", response.data);

//         // 設置班級名稱
//         setClassName(response.data.title || "未知班級");

//         // 處理學生數據（這裡假設後端返回的 groups 包含 userId 字段）
//         const groups = response.data.groups || [];
//         const studentData = groups.flatMap((group) =>
//           (group.userId || []).map((userId) => ({
//             group: group.groupName,
//             name: userId,
//             onlineTime: "未知",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           }))
//         );
//         setStudents(studentData.length > 0 ? studentData : [
//           {
//             group: "是否支持使用核電",
//             name: "SHENG54665746584",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//           {
//             group: "是否支持使用核電",
//             name: "sheng1",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//           {
//             group: "TEST",
//             name: "SHENG54665746584",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//         ]);
//       } catch (error) {
//         console.error("無法獲取活動數據:", error);
//         setClassName("無法載入班級");
//         setStudents([
//           {
//             group: "是否支持使用核電",
//             name: "SHENG54665746584",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//           {
//             group: "是否支持使用核電",
//             name: "sheng1",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//           {
//             group: "TEST",
//             name: "SHENG54665746584",
//             submissionTime: "尚未繳交",
//             essay: "Essay",
//             reviewed: false,
//           },
//         ]);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleMessageClick = () => {
//     navigate("/MessageBoard");
//   };

//   const handleEssayClick = () => {
//     navigate("/CorrectEssays");
//   };

//   const handleReviewChange = (index) => {
//     const updatedStudents = [...students];
//     updatedStudents[index].reviewed = !updatedStudents[index].reviewed;
//     setStudents(updatedStudents);
//   };

//   const handleCancel = () => {
//     navigate("/teacher/teacher_home");
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ padding: "20px" }}>
//         <Typography variant="h5" style={{ marginBottom: "20px" }}>
//           班級: {className}
//         </Typography>

//         <StyledTableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <StyledTableHeadCell>主題</StyledTableHeadCell>
//                 <StyledTableHeadCell>姓名</StyledTableHeadCell>
//                 <StyledTableHeadCell>總上線時間</StyledTableHeadCell>
//                 <StyledTableHeadCell>議論文繳交時間</StyledTableHeadCell>
//                 <StyledTableHeadCell>批改議論文</StyledTableHeadCell>
//                 <StyledTableHeadCell>留言</StyledTableHeadCell>
//                 <StyledTableHeadCell>批改</StyledTableHeadCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {students.map((student, index) => (
//                 <TableRow key={index}>
//                   <StyledTableCell>{student.group}</StyledTableCell>
//                   <StyledTableCell>{student.name}</StyledTableCell>
//                   <StyledTableCell>{student.onlineTime}</StyledTableCell>
//                   <StyledTableCell>{student.submissionTime}</StyledTableCell>
//                   <StyledTableCell>
//                     <EssayLink onClick={handleEssayClick}>
//                       {student.essay}
//                     </EssayLink>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <MessageButton variant="contained" onClick={handleMessageClick}>
//                       留言
//                     </MessageButton>
//                   </StyledTableCell>
//                   <StyledTableCell>
//                     <Checkbox
//                       checked={student.reviewed}
//                       onChange={() => handleReviewChange(index)}
//                     />
//                   </StyledTableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </StyledTableContainer>

//         <div style={{ textAlign: "right" }}>
//           <StyledButton variant="contained" onClick={handleCancel}>
//             Cancel
//           </StyledButton>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Studentlist;








import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar_Teacher";
import { styled } from "@mui/system";
import axios from "axios";
import url from "../url.json";

// 定義樣式
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: "20px auto",
  maxWidth: "90%",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    maxWidth: "100%",
    margin: "10px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "16px",
  padding: "12px",
  textAlign: "center",
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "14px",
    padding: "8px",
  },
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  color: "#333",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: "10px",
  backgroundColor: "#e0e0e0",
  color: "#333",
  "&:hover": {
    backgroundColor: "#d5d5d5",
  },
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "14px",
    padding: "6px 12px",
  },
}));

const MessageButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#42a5f5",
  color: "white",
  "&:hover": {
    backgroundColor: "#2196f3",
  },
  [theme?.breakpoints?.down("sm") || "@media (max-width: 600px)"]: {
    fontSize: "12px",
    padding: "4px 8px",
  },
}));

const EssayLink = styled("span")({
  color: "#1976d2",
  cursor: "pointer",
  textDecoration: "underline",
  "&:hover": {
    color: "#115293",
  },
});

const Studentlist = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState("載入中...");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const activityId = localStorage.getItem("activityId");
    console.log("Current activityId in Studentlist:", activityId);
    if (!activityId) {
      setClassName("無效活動");
      return;
    }

    const fetchActivityData = async () => {
      try {
        const baseUrl = url.backendHost.endsWith("/") ? url.backendHost.slice(0, -1) : url.backendHost;
        const response = await axios.get(`${baseUrl}/api/activities/${activityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Cache-Control": "no-cache",
          },
        });
        console.log("Fetched activity data in Studentlist:", response.data);

        // 設置班級名稱
        const fetchedClassName = response.data.title || "未知班級";
        setClassName(fetchedClassName);

        // 從後端獲取 Notion 資料庫中的學生資料
        const fetchNotionData = async () => {
          try {
            const notionResponse = await axios.get(
              `http://localhost:4000/api/get-students-by-class/${encodeURIComponent(fetchedClassName)}`
            );

            console.log("後端返回的學生資料:", notionResponse.data);

            if (notionResponse.data.success && notionResponse.data.data.length > 0) {
              // 映射後端返回的資料到 students 狀態
              const notionStudents = notionResponse.data.data.map((student) => ({
                group: student.theme || "未知主題",
                name: student.studentName || "未知學生",
                onlineTime: "", // 總上線時間先留空
                submissionTime: student.submissionDate ? new Date(student.submissionDate).toLocaleDateString('zh-TW') : "尚未繳交",
                essay: "Essay",
                reviewed: false,
              }));
              setStudents(notionStudents);
            } else {
              // 如果沒有數據，回退到默認數據
              setStudents([
                {
                  group: "是否支持使用核電",
                  name: "SHENG54665746584",
                  submissionTime: "尚未繳交",
                  essay: "Essay",
                  reviewed: false,
                },
                {
                  group: "是否支持使用核電",
                  name: "sheng1",
                  submissionTime: "尚未繳交",
                  essay: "Essay",
                  reviewed: false,
                },
                {
                  group: "TEST",
                  name: "SHENG54665746584",
                  submissionTime: "尚未繳交",
                  essay: "Essay",
                  reviewed: false,
                },
              ]);
            }
          } catch (notionError) {
            console.error("無法從後端獲取 Notion 數據:", notionError);
            setStudents([
              {
                group: "是否支持使用核電",
                name: "SHENG54665746584",
                submissionTime: "尚未繳交",
                essay: "Essay",
                reviewed: false,
              },
              {
                group: "是否支持使用核電",
                name: "sheng1",
                submissionTime: "尚未繳交",
                essay: "Essay",
                reviewed: false,
              },
              {
                group: "TEST",
                name: "SHENG54665746584",
                submissionTime: "尚未繳交",
                essay: "Essay",
                reviewed: false,
              },
            ]);
          }
        };

        await fetchNotionData();
      } catch (error) {
        console.error("無法獲取活動數據:", error);
        setClassName("無法載入班級");
        setStudents([
          {
            
          },
        ]);
      }
    };

    fetchActivityData();
  }, []);

  const handleMessageClick = () => {
    navigate("/MessageBoard");
  };

  const handleEssayClick = () => {
    navigate("/CorrectEssays");
  };

  const handleReviewChange = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].reviewed = !updatedStudents[index].reviewed;
    setStudents(updatedStudents);
  };

  const handleCancel = () => {
    navigate("/teacher/teacher_home");
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          班級: {className}
        </Typography>

        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>主題</StyledTableHeadCell>
                <StyledTableHeadCell>姓名</StyledTableHeadCell>
                {/* <StyledTableHeadCell>總上線時間</StyledTableHeadCell> */}
                <StyledTableHeadCell>議論文繳交時間</StyledTableHeadCell>
                <StyledTableHeadCell>批改議論文</StyledTableHeadCell>
                <StyledTableHeadCell>留言</StyledTableHeadCell>
                <StyledTableHeadCell>批改</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{student.group}</StyledTableCell>
                  <StyledTableCell>{student.name}</StyledTableCell>
                  <StyledTableCell>{student.onlineTime || "未知"}</StyledTableCell>
                  <StyledTableCell>{student.submissionTime}</StyledTableCell>
                  <StyledTableCell>
                    <EssayLink onClick={handleEssayClick}>
                      {student.essay}
                    </EssayLink>
                  </StyledTableCell>
                  <StyledTableCell>
                    <MessageButton variant="contained" onClick={handleMessageClick}>
                      留言
                    </MessageButton>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Checkbox
                      checked={student.reviewed}
                      onChange={() => handleReviewChange(index)}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <div style={{ textAlign: "right" }}>
          <StyledButton variant="contained" onClick={handleCancel}>
            Cancel
          </StyledButton>
        </div>
      </div>
    </div>
  );
};

export default Studentlist;