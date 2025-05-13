const db = require('../models');
const path = require('path');


// Assigning activities to the variable Activity
const ActivityInfo = db.ActivityInfo;


// Get a ActivityInfo by the activityId.
exports.findOne = (req, res) => {
    const activityId = req.params.activityId;
    ActivityInfo.findOne({
        where: { activityId: activityId },
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                activity:
                    err.message || "Some error occurred while retrieving activityInfo.",
            });
        });
};

// Update a ActivityInfo by the activityId.
exports.update = (req, res) => {
    const activityId = req.params.activityId;
    ActivityInfo.update(req.body, {
        where: { activityId: activityId },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "ActivityInfo was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update ActivityInfo with id=${activityId}. Maybe ActivityInfo was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                activity:
                    err.message || "Error updating ActivityInfo with id=" + activityId,
            });
        });
};
// Create a Info dateframe for the Activity.
exports.create = async (req, res) => {
    const activityInfo = await ActivityInfo.create({
        activityId: req.body.activityId,
        settings: {
            // navbar: getDefaultNavBar(),
            chatmode: "mindmap",
        },
        userId: req.body.userId,
    });    
            
    activityInfo
        .save()
        .then((data) => {
            // console.log('data: ', data)
            res.send(data);
            // console.log("Create activity success~🎉")
        })
        .catch((err) => {
            res.status(500).send({
                activity:
                    err.message || "Some error occurred while creating the activity.",
            });
        });
}
function getDefaultNavBar() {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

    const modalConfigurations = process.env.DefaultNavbarConfigurations;
    if (modalConfigurations) {
        return JSON.parse(modalConfigurations);
    } else {
        return [
            { text: "新增想法", modalKey: "createIdea", icon: "IdeaIcon" },
            { text: "新增提問", modalKey: "createQuestion", icon: "QuestionIcon" },
            { text: "新增資訊", modalKey: "createInformation", icon: "InformationIcon" },
            { text: "新增實驗", modalKey: "createFlask", icon: "FlaskIcon" },
            { text: "新增紀錄", modalKey: "createNote", icon: "NoteIcon" },
        ];
    }
    
}

