export const sendMessage = (ws) => {
  // console.log("2",typeof ws);
  ws.emit('event01', { data: '回傳發送訊息的...' }, (response) => {
    // console.log("event01 sender status: ", response);
  });
  ws.emit('create-node', { data: '回傳發送訊息的...' }, (response) => {
    // console.log("event01 sender status: ", response);
  });
};

export const sendNewNodeMessage = (ws, node) => {
  // console.log("[SOCKET] sendNewNodeMessage: ", node);

  ws.emit('create-node', node, (response) => {
    // console.log("event01 sender status: ", response);
  });
};

export const sendNewEdgeMessage = (ws, edge) => {
  // console.log("[SOCKET] sendNewEdgeMessage: ", edge);

  ws.emit('create-edge', edge, (response) => {
    // console.log("event01 sender status: ", response);
  });
};

export const sendNewChatRoomMessage = (ws, message) => {
  // console.log("[SOCKET] sendNewEdgeMessage: ", edge);
  console.log(ws, message);
  ws.emit('create-message', message, (response) => {
    // console.log("event01 sender status: ", response);
  });
};

// export const joinRoom = (ws, groupId) => {
//   // console.log("[SOCKET] sendNewEdgeMessage: ", edge);

//   ws.emit('join-room', groupId, (response) => {
//     // console.log("event01 sender status: ", response);
//   });
// };
