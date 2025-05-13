import {NodeCreator} from './NodeCreator';



export const CreateFlask = ({ open, onClose, ws }) => {
  const nodePlan = {
    title: "新增實驗",
    label: "實驗標題",
    tags: "experiment",
    helperMsg: "請為你提供的實驗下一個標題，讓其他同學能更快速的了解你提供了什麼資訊！",
    saffoldBody: [],
    scaffoldWords: []
  };

 return NodeCreator({ open, onClose, ws, nodePlan});
}