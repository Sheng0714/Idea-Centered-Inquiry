module.exports = app => {
    const bodyParser = require('body-parser');
    const chatRoomMessage = require("../controllers/chatRoomMessage.controller");
    
    var router = require("express").Router();

    // Create an message.
    router.post('/create', bodyParser.json(), chatRoomMessage.create);

    // Find all nodes in group.
    router.get('/all/:groupId', chatRoomMessage.findAllMessage);

    app.use('/api/chatRoomMessage', router);
}