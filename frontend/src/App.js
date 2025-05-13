import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './editorStyles.css';
import Home from "./pages/Home";
import About from './pages/About';
import Footer from './components/Footer';
import Index from './pages/Index';
import IndexOfTeacher from './pages/teacher/index';
import Forum from './pages/Forum';
import ForumModes_chatroom from './pages/ForumMode/ForumChatRoom.js';
import ForumModes_posts from './pages/ForumMode/ForumPosts.js';

import Dashboard from './pages/Dashboard';
import PrepareLessons from './pages/teacher/PrepareLessons'
import { RequireAuth } from 'react-auth-kit';
import { ModeProvider } from './contexts/ModeContext';
import { KF } from "./components/kf"; // 導入 KF 組件
import KFWeb from './components/kfweb';  // 正確導入 KFWeb
// import KF_TEACHER from './components/kf_teacher';  // 正確導入 KFWeb
import WritingArea from './components/writing_area';
// import AboutPage from './components/AboutPage';
// import About_logout from './components/About_logout';
// import Chatbot from './components/Chatbot';
import { Teacher_Home } from './pages/teacher/teacher_home'; // 導入 KF 組件
import  Studentlist  from './components/Studentlist'; // 導入 KF 組件
import  MessageBoard  from './components/MessageBoard'; // 導入 KF 組件
import  CorrectEssays  from './components/CorrectEssays'; // 導入 KF 組件
import  ActivityList   from './components/ActivityList';
import KFWebSTUDENT from './components/kfweb_student.js';  // 正確導入 KFWeb
import AboutStudent from './pages/About_student.js';
import AboutTeacher from './pages/About_teacher.js';
import AboutHome from './pages/About_Home.js';

export default function App() {
  return (
    <ModeProvider>
      <Router className="App">
          <Routes>
              <Route path='/' element={[<Home/>, <About/>, <Footer/>]}></Route>
              <Route path='/about' element={<About/>}></Route>
              <Route path='/home' element={<RequireAuth loginPath='/'><Index/></RequireAuth>}></Route>
              <Route path='/teacher/home' element={<RequireAuth loginPath='/'><IndexOfTeacher/></RequireAuth>}></Route>
              <Route path='/forum' element={<RequireAuth loginPath='/'><Forum/></RequireAuth>}></Route>
              <Route path='/dashboard' element={<RequireAuth loginPath='/'><Dashboard/></RequireAuth>}></Route>
              <Route path='/forum/modes/chatroom' element={<RequireAuth loginPath='/'><ForumModes_chatroom/></RequireAuth>}></Route>
              <Route path='/forum/modes/posts' element={<RequireAuth loginPath='/'><ForumModes_posts/></RequireAuth>}></Route>
              <Route path='/teacher/pageOfPrepareLesson' element={<RequireAuth loginPath='/'><PrepareLessons/></RequireAuth>}></Route>
              <Route path="/teacher/teacher_home" element={<Teacher_Home />} /> {/* 路由顯示 About 頁面 */}
              <Route path="/kfweb" element={<KFWeb />} />  {/* 對應到 KFWeb 組件 */}
              <Route path='/kf' element={<KF />} /> {/* 新增 /kf 路由 */}
              <Route path="/writing_area" element={<WritingArea />} />
              <Route path="/Studentlist" element={<Studentlist />} />
              <Route path="/MessageBoard" element={<MessageBoard />} />
              <Route path="/CorrectEssays" element={<CorrectEssays />} />
              <Route path="/ActivityList" element={<ActivityList />} />
              <Route path="/kfweb_student" element={<KFWebSTUDENT />} />  {/* 對應到 KFWeb 組件 */}
              <Route path='/About_student' element={<AboutStudent/>}></Route>
              <Route path='/About_teacher' element={<AboutTeacher/>}></Route>
              <Route path='/About_Home' element={<AboutHome/>}></Route>
          </Routes>
      </Router>
    </ModeProvider>
  );
}