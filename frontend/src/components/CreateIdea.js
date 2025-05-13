import {NodeCreator} from './NodeCreator';



export const CreateIdea = ({ open, onClose, ws }) => {
  const nodePlan = {
    title: "新增想法",
    label: "想法標題",
    tags: "idea",
    helperMsg: "請為你的想法下一個標題，讓其他同學能更快速的你的想法！",
    saffoldBody: [
      "【💡我的想法】",
      "【🧐我覺得更好的想法】",
      "【❓我想知道】",
      "【🙅🏻這個想法不能解釋】",
      "【📄舉例和參考來源】",
      "【✍🏻我的總結】"
    ],
    scaffoldWords: ["我的想法", "我覺得更好的想法", "我想知道", "這個想法不能解釋", "舉例和參考來源", "我的總結"]
  };

 return NodeCreator({ open, onClose, ws, nodePlan});
}