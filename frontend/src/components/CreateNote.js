import {NodeCreator} from './NodeCreator';



export const CreateNote = ({ open, onClose, ws }) => {
  const nodePlan = {
    title: "新增紀錄",
    label: "紀錄標題",
    tags: "record",
    helperMsg: "請為你紀錄下一個標題，讓其他同學能更快速的了解你紀錄了什麼內容！",
    saffoldBody: [
    ],
    scaffoldWords: []
  };

 return NodeCreator({ open, onClose, ws, nodePlan});
}