const User = require('./user.controller');
const Profile = require('./profile.controller');
const Activity = require('./activity.controller');
const Groups = require('./group.controller');
const Part = require('./part.controller');
const SubPart = require('./subPart.controller');
const Node = require('./node.controller');
const Edge = require('./edge.controller');
const ChatRoomMessage = require('./chatRoomMessage.controller');
const Essay = require('./essay.controller'); // 新增 Essay 控制器

module.exports = {
  User,
  Profile,
  Activity,
  Groups,
  Part,
  SubPart,
  Node,
  Edge,
  ChatRoomMessage,
  Essay // 新增 Essay
};