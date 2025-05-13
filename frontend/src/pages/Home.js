// import React from "react";
// import Navbar from "../components/HomePage_Navbar";
// import BannerImage from "../assets/home-banner-image.png";
// import { FiArrowRight } from "react-icons/fi";
// import { Register } from "../components/Register";

// export default function Home() {
//     return (
//         <div className="home-container">
//             <Navbar />
//             <div className="home-banner-container">
//                 <div className="home-text-section">
//                     <h1 className="primary-heading">
//                         以想法為中心，
//                         <br/>
//                         盡情探究
//                     </h1>
//                     <button className="secondary-button">
//                         加入我們吧！前往
//                         <Register />
//                         <FiArrowRight />{" "}
//                     </button>
//                 </div>
//                 <div className="home-image-section">
//                     <img src={BannerImage} alt="" />
//                 </div>
//             </div>
//         </div>
//     )
// }




// import React, { useState } from "react";
// import Navbar from "../components/HomePage_Navbar";
// import axios from "axios";
// import { useSignIn } from "react-auth-kit";
// import { useNavigate } from "react-router-dom";
// import {
//   TextField,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   FormControl,
//   FormLabel,
// } from "@mui/material";
// import url from "../url.json";
// import config from "../config.json";
// import { Register } from "../components/Register";
// import { Login } from "../components/Login"; // 假設您已將 Login 組件放在這個路徑

// export default function Home() {
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//   });
//   const [role, setRole] = useState("student"); // 預設為 student
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [openLogin, setOpenLogin] = useState(false); // 控制 Login 對話框
//   const [openRegister, setOpenRegister] = useState(false); // 控制 Register 對話框

//   const signIn = useSignIn();
//   const navigate = useNavigate();

//   // 處理表單輸入變化
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // 處理角色選擇變化
//   const handleRoleChange = (e) => {
//     setRole(e.target.value);
//   };

//   // 處理表單提交
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userData = {
//       email: data.email,
//       password: data.password,
//       role, // 將 role 傳給後端（如果後端需要）
//     };
//     try {
//       const response = await axios.post(
//         url.backendHost + config[1].loginUrl,
//         userData
//       );
//       setIsLoggedIn(true);
//       setData({ email: "", password: "" });

//       // 使用 react-auth-kit 的 signIn
//       signIn({
//         token: response.data.jwtToken,
//         expiresIn: 3600,
//         tokenType: "Bearer",
//         authState: { ...response.data },
//       });

//       // 儲存到 localStorage
//       localStorage.setItem("jwtToken", response.data.jwtToken);
//       localStorage.setItem("userId", response.data.id);
//       localStorage.setItem("name", response.data.name);
//       localStorage.setItem("email", response.data.email);
//       localStorage.setItem("role", role);

//       alert("登入成功!");

//       // 根據角色跳轉頁面
//       if (role === "student") {
//         navigate("/kf");
//       } else if (role === "teacher") {
//         navigate("/teacher/teacher_home");
//       }
//     } catch (error) {
//       if (!error.response) {
//         alert("後端伺服器連結失敗");
//       } else {
//         switch (error.response.status) {
//           case 401:
//             alert("登入授權失敗，請確認帳號密碼");
//             break;
//           default:
//             alert("未知錯誤，請聯絡管理員: " + error.response.status);
//         }
//       }
//     }
//   };

//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="home-banner-container">
//         <div className="home-text-section">
//           <h1 className="primary-heading">
//             Inspire Thinking
//             <br />
//             Write Infinite Possibilities
//           </h1>
//         </div>

//         <div
//           style={{
//             backgroundColor: "white",
//             padding: "20px",
//             marginRight: "-150px",
//             marginTop: "80px",
//             width: "500px",
//             margin: "0 auto",
//           }}
//         >
//           <form onSubmit={handleSubmit}>
//             <TextField
//               label="Please enter your email"
//               type="email"
//               name="email"
//               value={data.email}
//               fullWidth
//               onChange={handleChange}
//               style={{ marginBottom: "16px" }}
//             />
//             <TextField
//               label="Please enter your password"
//               type="password"
//               name="password"
//               value={data.password}
//               fullWidth
//               onChange={handleChange}
//               style={{ marginBottom: "16px" }}
//             />
//             <FormControl
//               component="fieldset"
//               style={{ marginBottom: "16px" }}
//             >
//               <FormLabel component="legend">Role</FormLabel>
//               <RadioGroup row value={role} onChange={handleRoleChange}>
//                 <FormControlLabel
//                   value="student"
//                   control={<Radio />}
//                   label="Student"
//                 />
//                 <FormControlLabel
//                   value="teacher"
//                   control={<Radio />}
//                   label="Teacher"
//                 />
//               </RadioGroup>
//             </FormControl>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               style={{ marginLeft: "16px", top: "28px" }}
//             >
//               Login
//             </Button>

//             <div style={{ marginTop: "16px" }}>
//               Haven't registered yet?
//               {/* <button
//                 type="button"
//                 className="register-button"
//                 style={{ marginLeft: "20px" }}
//                 onClick={() => setOpenRegister(true)}
//               >
//                 register
//                 <Register />
//               </button> */}
//               <button type="button" className='register-button' style={{ marginLeft: '20px'}}>register<Register /></button>
//                             {/* <Button variant="outlined" color="secondary" style={{ marginLeft: '20px' }} onClick={handleForgetPasswordClick}>
//                 forget the password?
//             </Button> */}
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* 整合 Login 組件作為對話框 */}
//       <Login
//         open={openLogin}
//         setOpen={setOpenLogin}
//         setOpenRegister={setOpenRegister}
//       />
//     </div>
//   );
// }






import React, { useState } from "react";
import Navbar from "../components/HomePage_Navbar";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import url from "../url.json";
import config from "../config.json";
import { Register } from "../components/Register"; // 確保路徑正確
import { Login } from "../components/Login";

export default function Home() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState("student");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: data.email,
      password: data.password,
      role,
    };
    try {
      const response = await axios.post(
        url.backendHost + config[1].loginUrl,
        userData
      );
      setIsLoggedIn(true);
      setData({ email: "", password: "" });
      signIn({
        token: response.data.jwtToken,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { ...response.data },
      });
      localStorage.setItem("jwtToken", response.data.jwtToken);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", role);
      alert("Login Successful!");
      if (role === "student") navigate("/kf");
      else if (role === "teacher") navigate("/teacher/teacher_home");
    } catch (error) {
      if (!error.response) {
        alert("後端伺服器連結失敗");
      } else {
        switch (error.response.status) {
          case 401:
            alert("登入授權失敗，請確認帳號密碼");
            break;
          default:
            alert("未知錯誤，請聯絡管理員: " + error.response.status);
        }
      }
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
            Inspire Thinking
            <br />
            Write Infinite Possibilities
            <br />
            with AI
          </h1>
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            marginRight: "-150px",
            marginTop: "80px",
            width: "500px",
            margin: "0 auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              label="Please enter your email"
              type="email"
              name="email"
              value={data.email}
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              label="Please enter your password"
              type="password"
              name="password"
              value={data.password}
              fullWidth
              onChange={handleChange}
              style={{ marginBottom: "16px" }}
            />
            <FormControl
              component="fieldset"
              style={{ marginBottom: "16px" }}
            >
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup row value={role} onChange={handleRoleChange}>
                <FormControlLabel
                  value="student"
                  control={<Radio />}
                  label="Student"
                />
                <FormControlLabel
                  value="teacher"
                  control={<Radio />}
                  label="Teacher"
                />
              </RadioGroup>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginLeft: "16px", top: "28px" }}
            >
              Login
            </Button>

            <div style={{ marginTop: "16px" }}>
              Haven't registered yet?
              <Button
                variant="outlined"
                color="secondary"
                style={{ marginLeft: "20px" }}
                onClick={() => setOpenRegister(true)}
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Login
        open={openLogin}
        setOpen={setOpenLogin}
        setOpenRegister={setOpenRegister}
      />
      <Register
        open={openRegister}
        setOpen={setOpenRegister}
        setOpenLogin={setOpenLogin}
      />
    </div>
  );
}