const { authenticateJWT } = require('../middleware/jwt_auth.js'); // 引入 JWT 驗證中間件

module.exports = app => {
    const bodyParser = require('body-parser');
    const edges = require("../controllers/edge.controller");
    
    var router = require("express").Router();
    router.use(bodyParser.json());

    // Create an edge.
    router.post('/create',  authenticateJWT, edges.create);

    // Find all edges in a group.
    router.get('/all/:groupId',  authenticateJWT,edges.findAllEdge);

    // // Get one node.
    // router.get('/:id', nodes.findOneNode);

    // // Update one node.
    // router.put('/:nodeId', nodes.updateNode);

    app.use('/api/edges', router);
}