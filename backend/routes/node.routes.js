const { authenticateJWT } = require('../middleware/jwt_auth.js'); // 引入 JWT 驗證中間件

module.exports = app => {
    const bodyParser = require('body-parser');
    const nodes = require("../controllers/node.controller");
    
    var router = require("express").Router();
    router.use(bodyParser.json());

    // Create an node.
    router.post('/create', authenticateJWT, nodes.create);

    // Find all nodes in group.
    router.get('/all/:groupId', authenticateJWT, nodes.findAllNode);

    // Get one node.
    router.get('/:id', authenticateJWT, nodes.findOneNode);

    // Update one node.
    router.put('/:nodeId', authenticateJWT, nodes.updateNode);

    app.use('/api/nodes', router);
}