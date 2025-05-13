import {NodeCreator} from './NodeCreator';


export const CreateReply = ({ open, onClose,nodeContent, ws }) => {
  const nodePlan = {
    title: "新增回覆",
    label: "回覆標題",
    tags: "reply",
    helperMsg: "請為你提供的回覆下一個標題，讓其他同學能更快速的了解你提供了什麼資訊！",
    saffoldBody: [
      "【💡我的想法】",
      "【🧐我覺得更好的想法】",
      "【❓我想知道】",
      "【🙅🏻這個想法不能解釋】",
      "【📄舉例和參考來源】",
      "【✍🏻我的總結】"
    ],
    scaffoldWords: ["我的想法", "我覺得更好的想法", "我想知道", "這個想法不能解釋", "舉例和參考來源", "我的總結"],
    newEdge: true,
    note: nodeContent?nodeContent.content: null
  };

 return NodeCreator({ open, onClose, ws, nodePlan});
}