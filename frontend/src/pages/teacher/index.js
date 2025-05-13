import config from '../../config.json';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import IndexPage_Navbar from '../../components/IndexPageOfTeacher_Navbar';
import Navbar from "../../components/Navbar_Teacher";

import {
  Grid,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import io from 'socket.io-client';
import MyCreatedActivityCard from '../../components/MyCreatedActivityCard';
import url from '../../url.json';


export default function IndexOfTeacher() {
  const [sortOrder, setSortOrder] = useState('new_to_old'); // 重命名狀態變數
  const [activities, setActivities] = useState([]);
  const [ws, setWs] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event) => {
    setSortOrder(event.target.value);
  };

  const connectWebSocket = () => {
    setWs(io(url.backendHost));
  };

  useEffect(() => {
    const getActivities = async () => {
      try {
        const fetchData = await axios.get(`${url.backendHost + config[13].MyCreatedActivity}/${localStorage.getItem('userId')}`);
        setActivities(fetchData.data);
      } catch (err) {
        // console.log(err);
      }
    };
    getActivities();

    if (ws) {
      initWebSocket();
    }
  }, [ws]);

  const initWebSocket = () => {
    ws.on('connect', () => {
      // console.log(ws.id);
    });

    ws.on('event02', (arg, callback) => {
      // console.log(arg);
      callback({
        status: 'event02 ok',
      });
    });
  };

  // 根據排序順序對活動進行排序
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (sortOrder === 'new_to_old') {
      return dateB - dateA; // 新到舊
    } else {
      return dateA - dateB; // 舊到新
    }
  });

  return (
    <div className="home-container">
      <Navbar />
      <IndexPage_Navbar callback_setActivities={setActivities}/>
      <h2>The class theme I created</h2>
      <Box sx={{ maxWidth: 200, marginBottom: 2 }} className="activity-status">
        <FormControl fullWidth>
          <InputLabel id="sort-order-label">sort</InputLabel> {/* 更改為「排序」 */}
          <Select
            labelId="sort-order-label"
            id="sort-order-select"
            value={sortOrder}
            label="排序"
            onChange={handleChange}
          >
            <MenuItem value="new_to_old">new_to_old</MenuItem> {/* 新到舊 */}
            <MenuItem value="old_to_new">old_to_new</MenuItem> {/* 舊到新 */}
          </Select>
        </FormControl>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
        style={{ paddingRight: '120px', paddingLeft: '120px' }}
      >
        {sortedActivities.map((activity) => (
          <Grid item xs={12} sm={isMobile ? 8 : 4} key={activity.id}>
            <MyCreatedActivityCard activity={activity} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}


// //第二版
// import config from '../../config.json';
// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import IndexPage_Navbar from '../../components/IndexPageOfTeacher_Navbar';
// import {
//   Grid,
//   Select,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Box,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import io from 'socket.io-client';
// import MyCreatedActivityCard from '../../components/MyCreatedActivityCard';
// import MyCreatedClass from '../../components/MyCreatedClass';
// import url from '../../url.json';

// export default function IndexOfTeacher() {
//   const [sortOrder, setSortOrder] = useState('new_to_old'); // 重命名狀態變數
//   const [activities, setActivities] = useState([]);
//   const [ws, setWs] = useState(null);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleChange = (event) => {
//     setSortOrder(event.target.value);
//   };

//   const connectWebSocket = () => {
//     setWs(io(url.backendHost));
//   };

//   useEffect(() => {
//     const getActivities = async () => {
//       try {
//         const fetchData = await axios.get(`${url.backendHost + config[13].MyCreatedActivity}/${localStorage.getItem('userId')}`, {
//           headers: {
//             authorization: 'Bearer JWT Token',
//           },
//         });
//         setActivities(fetchData.data);
//       } catch (err) {
//         // console.log(err);
//       }
//     };
//     getActivities();

//     if (ws) {
//       initWebSocket();
//     }
//   }, [ws]);

//   const initWebSocket = () => {
//     ws.on('connect', () => {
//       // console.log(ws.id);
//     });

//     ws.on('event02', (arg, callback) => {
//       // console.log(arg);
//       callback({
//         status: 'event02 ok',
//       });
//     });
//   };

//   // 根據排序順序對活動進行排序
//   const sortedActivities = [...activities].sort((a, b) => {
//     const dateA = new Date(a.createdAt);
//     const dateB = new Date(b.createdAt);
//     if (sortOrder === 'new_to_old') {
//       return dateB - dateA; // 新到舊
//     } else {
//       return dateA - dateB; // 舊到新
//     }
//   });

//   return (
//     <div className="home-container">
//       <IndexPage_Navbar callback_setActivities={setActivities}/>
//       <h2>The argumentative essay discussion question I created</h2>
//       <Box sx={{ maxWidth: 200, marginBottom: 2 }} className="activity-status">
//         <FormControl fullWidth>
//           <InputLabel id="sort-order-label">sort</InputLabel> {/* 更改為「排序」 */}
//           <Select
//             labelId="sort-order-label"
//             id="sort-order-select"
//             value={sortOrder}
//             label="排序"
//             onChange={handleChange}
//           >
//             <MenuItem value="new_to_old">new_to_old</MenuItem> {/* 新到舊 */}
//             <MenuItem value="old_to_new">old_to_new</MenuItem> {/* 舊到新 */}
//           </Select>
//         </FormControl>
//       </Box>

//       <Grid
//         container
//         direction="row"
//         justifyContent="center"
//         alignItems="stretch"
//         spacing={3}
//         style={{ paddingRight: '120px', paddingLeft: '120px' }}
//       >
//         {sortedActivities.map((activity) => (
//           <Grid item xs={12} sm={isMobile ? 8 : 4} key={activity.id}>
//             <MyCreatedClass activity={activity} />
//           </Grid>
//         ))}
//       </Grid>

//       <Grid
//         container
//         direction="row"
//         justifyContent="center"
//         alignItems="stretch"
//         spacing={3}
//         style={{ paddingRight: '120px', paddingLeft: '120px' }}
//       >
//         {sortedActivities.map((activity) => (
//           <Grid item xs={12} sm={isMobile ? 8 : 4} key={activity.id}>
//             <MyCreatedActivityCard activity={activity} />
//           </Grid>
//         ))}
//       </Grid>

      
//     </div>
//   );
// }