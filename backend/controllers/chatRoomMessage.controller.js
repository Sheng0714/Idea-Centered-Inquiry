const db = require('../models');

// Assigning levels to the variable Group
const Group = db.Group;
const ChatRoomMessage = db.ChatRoomMessage;

// Create and Save new Node.
exports.create = async (req, res) => {
  const { userId, groupId, author, content } = req.body;
  try {
    const message = await ChatRoomMessage.create({
      userId: userId,
      groupId: groupId,
      author: author,
      content: content,
    });

    // console.log('Created message:', ChatRoomMessage);
    res.status(200).send({
      message: 'Message created successfully',
      chatRoomMessage: message,
    });
  } catch (err) {
    console.log('Error while creating message:', err);
    res.status(500).send({
      message: 'Error while creating message',
      error: err.message,
    });
  }
};

// Find all messages by groupId.
exports.findAllMessage = (req, res) => {
  const groupId = req.params.groupId;
  Group.findAll({
    where: {
      id: groupId,
    },
    include: [
      {
        model: ChatRoomMessage,
        through: { attributes: [] },
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find group with id=${groupId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error retrieving group with id=' + groupId,
      });
    });
};
