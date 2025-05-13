const { authenticateJWT } = require('../middleware/jwt_auth.js');
const essayController = require("../controllers/essay.controller");

module.exports = (app) => {
  const router = require("express").Router();

  router.post('/essays', authenticateJWT, (req, res, next) => {
    console.log('Received POST /api/essays with body:', req.body);
    next();
  }, essayController.createEssay);

  app.use("/api", router);
};