

// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar_login";

// const KFWeb = () => {
//   const navigate = useNavigate();
//   const [windowRef, setWindowRef] = useState(null); // 用來儲存新視窗的引用

//   // 開啟 KF 網站的彈出視窗
//   const openKFWeb = () => {
//     // 檢查是否已經有開啟的視窗
//     if (!windowRef || windowRef.closed) {
//       // 在同一頁面中彈出一個新瀏覽器窗口
//       const newWindow = window.open("https://kf6.nccu.edu.tw", "_blank", "width=800,height=600");
//       setWindowRef(newWindow); // 儲存新開啟的窗口引用
//     } else {
//       // 如果視窗已經開啟，則將其激活
//       windowRef.focus();
//     }
//   };

//   return (
//     <div>
//       <Navbar />
    
//     <div style={{ position: "relative", height: "100vh" }}>
      
//       <div
//         style={{
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "10px",
//         }}
//       >
        
//         {/* 點擊後會在同一頁面彈出 KF 網站的窗口 */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={openKFWeb} // 點擊後觸發 openKFWeb
//         >
//           KF Area
//         </Button>

//         {/* 跳轉到 Writing Area 頁面的按鈕 */}
//         {/* <Button
//           variant="contained"
//           color="secondary"
//           onClick={() => navigate("/writing_area")}
//         >
//           Writing Area
//         </Button> */}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default KFWeb;





// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import Navbar from "../components/Navbar_login";

// const KFWeb = () => {
//   const [windowRef, setWindowRef] = useState(null); // 用來儲存新視窗的引用

//   // 開啟或關閉 KF 網站的彈出視窗
//   const toggleKFWeb = () => {
//     if (!windowRef || windowRef.closed) {
//       // 如果視窗未開啟或已經關閉，則開啟一個新視窗
//       const newWindow = window.open("https://kf6.nccu.edu.tw/", "_blank", "width=800,height=600");
//       setWindowRef(newWindow); // 儲存新開啟的視窗引用
//     } else {
//       // 如果視窗已經開啟，則關閉它
//       windowRef.close();
//       setWindowRef(null); // 清除視窗引用
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ position: "relative", height: "100vh" }}>
//         <div
//           style={{
//             position: "absolute",
//             top: "20px",
//             right: "20px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "10px",
//           }}
//         >
//           {/* 點擊後會打開或關閉 KF 網站的視窗 */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={toggleKFWeb} // 點擊後觸發 toggleKFWeb
//           >
//             {windowRef && !windowRef.closed ? "Close KF Area" : "Open KF Area"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KFWeb;




//內嵌(按鈕版)
// import React, { useState } from "react";
// import { Button } from "@mui/material";
// import Navbar from "../components/Navbar_login";

// const KFWeb = () => {
//   const [isIframeVisible, setIframeVisible] = useState(false);

//   // 顯示或隱藏 iframe
//   const toggleIframe = () => {
//     setIframeVisible(!isIframeVisible);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ position: "relative", height: "100vh", padding: "20px" }}>
//         <div
//           style={{
//             position: "absolute",
//             top: "20px",
//             right: "20px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "10px",
//           }}
//         >
//           {/* 按鈕觸發顯示或隱藏 KF 網站的內嵌 iframe */}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={toggleIframe}
//           >
//             {isIframeVisible ? "Close KF Area" : "Open KF Area"}
//           </Button>
//         </div>

//         {/* 內嵌 KF 網站 */}
//         {isIframeVisible && (
//           <div
//             style={{
//               position: "absolute",
//               top: "60px", // 控制顯示位置
//               left: "0",
//               right: "0",
//               bottom: "0",
//               backgroundColor: "white",
//               zIndex: 1000,
//               boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <iframe
//               src="https://kf6.nccu.edu.tw/"
//               title="KF Area"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 border: "none",
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default KFWeb;





//內嵌沒按鈕版本
import React from "react";
import { Button } from "@mui/material";
import Navbar from "../components/Navbar_Student";

const KFWebSTUDENT = () => {
  return (
    <div>
      <Navbar />
      <div style={{ position: "relative", height: "100vh", padding: "20px" }}>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* 如果不需要按鈕，就可以去掉這部分 */}
          {/* <Button
            variant="contained"
            color="primary"
            onClick={toggleIframe}
          >
            Open KF Area
          </Button> */}
        </div>

        {/* 直接顯示內嵌 KF 網站 */}
        <div
          style={{
            position: "absolute",
            top: "60px", // 控制顯示位置
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "white",
            zIndex: 1000,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <iframe
            src="https://kf6.nccu.edu.tw/"
            title="KF Area"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KFWebSTUDENT;





























