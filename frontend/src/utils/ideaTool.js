import url from '../url.json';
import config from '../config.json';
import axios from 'axios';
import {
  sendNewNodeMessage,
  sendNewEdgeMessage,
  sendNewChatRoomMessage,
} from '../utils/socketTool';
// 定義每個群組對應的顏色
const colorMap = {
  idea: { border: '#FFFFCC', background: '#FFFFCC' },         // 淡黃色
  information: { border: '#CCFFCC', background: '#CCFFCC' },        // 淡綠色
  question: { border: '#CCCCFF', background: '#CCCCFF' },     // 淡藍色
  experiment: { border: '#FFDBDB', background: '#FFDBDB' },    // 淺紅色
  record: { border: '#B9DCF4', background: '#B9DCF4' },        // 淺藍色
  reply: { border: '#FFFFFF', background: '#FFFFFF' },         // 白色
  // 可以在此添加更多群組及其顏色
};

// 默認顏色
const defaultColor = { border: '#CCCCCC', background: '#EEEEEE' };

export const newNode = async (ideaData, activityId, ws) => {
  const isAnnouncement = ideaData.content.includes('【公告】'); // 判斷是否為公告

  return axios
    .post(url.backendHost + config[7].createNode, ideaData)
    .then((response) => {
      console.log('newNode');
      // console.log("5",typeof ws);
      sendNewNodeMessage(ws, {
        ...ideaData,
        id: response.data.node.id,
        createdAt: response.data.node.createdAt,
        updatedAt: response.data.node.updatedAt,
        activityId: activityId,
      });
      // 如果是公告，則發送公告專用事件
      if (isAnnouncement && ws) {
        ws.emit(`announcement-${ideaData.groupId}`, {
          ...ideaData,
          id: response.data.node.id,
          createdAt: response.data.node.createdAt,
        });
      }

      console.log('sendNewNodeMessage');
      console.log('sendNewNodeMessage');
      return response;
    });
};

export const newEdge = async (edgeData, activityId, ws) => {
  // console.log(`ideaTool:newEdge:edgeData ${edgeData}`);
  return axios
    .post(url.backendHost + config[9].createEdge, edgeData)
    .then((response) => {
      // console.log(response.status, response.data);
      // console.log("5",typeof ws);
      sendNewEdgeMessage(ws, {
        ...edgeData,
        activityId: activityId,
      });
      return response;
    });
};
function getEmoji(tag) {
  switch (tag) {
    case 'idea': {
      return '💡';
    }
    case 'information': {
      return '🔍';
    }
    case 'question': {
      return '❓';
    }
    case 'experiment': {
      return '🧪';
    }
    case 'record': {
      return '📄';
    }
    case 'reply': {
      return '💡';
    }
  }
}

const formatTimestamp = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
    // year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    //   second: 'numeric',
    hour12: false,
  }).format(new Date(timestamp));
};

export const genEdge = (edgeData) => {
  // console.log(`ideaTool:genEdge:edgeData `, edgeData);
  return {
    from: edgeData.from,
    to: edgeData.to,
  };
};

export const genNode = (ideaData) => {
  const color = colorMap[ideaData.tags] || defaultColor;
  const isAnnouncement = ideaData.content.includes('【公告】'); // 判斷是否為公告
  const node = {
    id: String(ideaData.id), // 確保 ID 是字串
    label:
      getEmoji(ideaData.tags) +
      '\n\n' +
      ideaData.title +
      '\n\n' +
      ideaData.author +
      '\n' +
      `${formatTimestamp(ideaData.createdAt)}`,
    title: ideaData.content,
    group: ideaData.tags,
    color: color, // 添加 color 屬性
    borderWidth: 1, // 默認邊框寬度
    isAnnouncement,
  };

  console.log('genNode:', node); // 調試用
  return node;
};

export const newMessage = async (messageData, ws) => {
  return axios
    .post(url.backendHost + config[17].createMessage, messageData)
    .then((response) => {
      console.log('newMessage');
      console.log(response.data.chatRoomMessage);
      sendNewChatRoomMessage(ws, messageData);
      console.log('sendNewChatRoomMessage');
      return response;
    });
};
