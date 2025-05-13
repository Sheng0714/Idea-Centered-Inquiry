module.exports = (sequelize, DataTypes) => {
  const ChatRoomMessage = sequelize.define('ChatRoomMessage', {
    userId: DataTypes.BIGINT,
    groupId: DataTypes.INTEGER,
    author: DataTypes.STRING,
    content: DataTypes.TEXT,
  });
  return ChatRoomMessage;
};
