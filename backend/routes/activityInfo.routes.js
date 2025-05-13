module.exports = app => {
    const bodyParser = require('body-parser');
    const activityInfo = require("../controllers/activityInfo.controller");
    var router = require("express").Router();


    // Create ActivityInfo.
    router.post('/', bodyParser.json(), activityInfo.create);
    
    // Get ActivityInfo by activityId.
    router.get('/:activityId', activityInfo.findOne);

    // Update a ActivityInfo with the specified id in the request.
    router.put('/:activityId', bodyParser.json(), activityInfo.update);

    app.use('/api/activityInfo', router);
}