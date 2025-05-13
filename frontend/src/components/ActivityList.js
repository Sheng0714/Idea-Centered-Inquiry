// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { styled } from '@mui/material';
// import MyCreatedActivityCard from './MyCreatedActivityCard';
// import url from '../url.json';

// const Container = styled('div')({
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '20px',
//     padding: '20px',
// });

// const ActivityList = () => {
//     const [activities, setActivities] = useState([]);

//     // 從後端獲取活動列表
//     const fetchActivities = async () => {
//         try {
//             const userId = localStorage.getItem('userId'); // 假設 userId 儲存在 localStorage
//             const response = await axios.get(`${url.backendHost}/api/activities/myActivity/${userId}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
//                 },
//             });
//             // 按 ID 或創建時間排序，確保遞補效果
//             const sortedActivities = response.data.sort((a, b) => a.id - b.id);
//             setActivities(sortedActivities);
//         } catch (error) {
//             console.error('獲取活動列表失敗:', error);
//             alert('獲取活動列表失敗，請稍後再試！');
//         }
//     };

//     useEffect(() => {
//         fetchActivities();
//     }, []);

//     // 處理刪除班級
//     const handleDeleteActivity = async (activityId) => {
//         try {
//             // 無需再次發送刪除請求，因為 MyCreatedActivityCard 已處理
//             // 直接更新前端狀態
//             setActivities((prevActivities) => prevActivities.filter((activity) => activity.id !== activityId));
//             // 可選擇重新從後端獲取最新數據，確保一致性
//             await fetchActivities();
//         } catch (error) {
//             console.error('更新活動列表失敗:', error);
//             alert('更新活動列表失敗，請稍後再試！');
//         }
//     };

//     return (
//         <Container>
//             {activities.map((activity) => (
//                 <MyCreatedActivityCard
//                     key={activity.id}
//                     activity={activity}
//                     onDelete={handleDeleteActivity}
//                 />
//             ))}
//         </Container>
//     );
// };

// export default ActivityList;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material';
import MyCreatedActivityCard from './MyCreatedActivityCard';
import url from '../url.json';

const Container = styled('div')({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
});

const ActivityList = () => {
    const [activities, setActivities] = useState([]);

    // 從後端獲取活動列表
    const fetchActivities = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`${url.backendHost}/api/activities/myActivity/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            // 從 localStorage 獲取隱藏的活動
            const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '{}');
            // 將活動分為未隱藏和已隱藏兩部分，並按 ID 排序
            const sortedActivities = response.data.sort((a, b) => a.id - b.id);
            const visibleActivities = sortedActivities.filter(activity => !hiddenActivities[activity.id]);
            const hiddenActivitiesList = sortedActivities.filter(activity => hiddenActivities[activity.id]);
            // 合併列表，隱藏的活動放在最後
            setActivities([...visibleActivities, ...hiddenActivitiesList]);
        } catch (error) {
            console.error('獲取活動列表失敗:', error);
            alert('獲取活動列表失敗，請稍後再試！');
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // 處理刪除班級
    const handleDeleteActivity = async (activityId) => {
        try {
            // 更新隱藏狀態（這裡假設 MyCreatedActivityCard 已處理 hiddenActivities）
            const hiddenActivities = JSON.parse(localStorage.getItem('hiddenActivities') || '{}');
            // 直接更新 activities 狀態，將隱藏的活動移到最後
            setActivities((prevActivities) => {
                const updatedActivities = prevActivities.filter(activity => activity.id !== activityId);
                const hiddenActivity = prevActivities.find(activity => activity.id === activityId);
                if (hiddenActivity && hiddenActivities[activityId]) {
                    // 如果活動被標記為隱藏，將其移到列表最後
                    return [...updatedActivities, hiddenActivity];
                }
                return updatedActivities;
            });
            // 可選擇重新從後端獲取最新數據，確保一致性
            await fetchActivities();
        } catch (error) {
            console.error('更新活動列表失敗:', error);
            alert('更新活動列表失敗，請稍後再試！');
        }
    };

    return (
        <Container>
            {activities.map((activity) => (
                <MyCreatedActivityCard
                    key={activity.id}
                    activity={activity}
                    onDelete={handleDeleteActivity}
                />
            ))}
        </Container>
    );
};

export default ActivityList;