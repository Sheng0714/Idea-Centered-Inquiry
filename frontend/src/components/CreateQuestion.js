import {NodeCreator} from './NodeCreator';



export const CreateQuestion = ({ open, onClose, ws }) => {


  const nodePlan = {
    title: "新增提問",
    label: "問題標題",
    tags: "question",
    helperMsg: "請為你提問下一個標題，讓其他同學能更快速的了解你想了解什麼！",
    saffoldBody: [
      "【我很好奇】",
      "【我想了解】",
      "【想請問】",
    ],
    scaffoldWords: ["我很好奇","我想了解","想請問"]
  };

 return NodeCreator({ open, onClose, ws, nodePlan});
}
   
