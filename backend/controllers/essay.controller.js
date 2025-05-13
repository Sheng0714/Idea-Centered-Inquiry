const db = require("../models");
const User = db.User;
const Activity = db.Activity;
const Essay = db.Essay;

exports.createEssay = async (req, res) => {
  try {
    const { title, content, activityId } = req.body;
    console.log("Received essay data:", { title, content, activityId, user: req.user });
    const userId = req.user.dataValues.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      return res.status(404).send({ message: "Activity not found" });
    }

    const essay = await Essay.create({
      userId: user.id,
      userName: user.name,
      title,
      content,
      activityId,
      submittedAt: new Date(),
    });

    return res.status(201).send({ message: "Essay created successfully", essay });
  } catch (error) {
    console.error("Error creating essay:", error);
    return res.status(500).send({ message: "Error creating essay", error: error.message });
  }
};