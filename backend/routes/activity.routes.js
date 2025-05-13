const { authenticateJWT } = require('../middleware/jwt_auth.js'); // 引入 JWT 驗證中間件

module.exports = app => {
    const bodyParser = require('body-parser');
    const activities = require("../controllers/activity.controller");
    
    var router = require("express").Router();
    router.use(bodyParser.json());

    router.post('/create', authenticateJWT, activities.create);

    // Create one group.
    // router.post('/createOneGroup',authenticateJWT, activities.createOneGroupForActivity);

    // Create many groups.
    router.post('/createGroups',authenticateJWT, activities.createGroupsForActivity);
    
    // Get user's all activity.
    router.get('/myActivity/:userId',authenticateJWT, activities.findMyActivity);

    // Get user's one activity.
    router.get('/:id', authenticateJWT, activities.findOneActivity);

    // Find all user in activity.
    router.get('/myJoined/:userId', authenticateJWT,activities.getJoinedActivitiesByUserId);

    // Clone one activity by id.
    // router.get('/clone/:activityId',authenticateJWT, activities.cloneActivity);

    // Update a Activity with the specified id in the request.
    router.put('/:activityId', authenticateJWT, activities.updateActivity);

    // Delete a Activity with the specified id in the request.
    router.delete('/:activityId', authenticateJWT, activities.delete);
    
    // Delete all activities.
    // router.delete('/', activities.deleteAll);

    app.use('/api/activities', router);
}