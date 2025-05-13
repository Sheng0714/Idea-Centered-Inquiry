module.exports = (sequelize, DataTypes) => {
  const ActivityInfo = sequelize.define("ActivityInfo", {
    activityId: DataTypes.BIGINT,
    settings: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    activityId: {
      type: DataTypes.BIGINT,
      // references: {
      //   model: 'Activities',
      //   key: 'id'
      // },
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      // references: {
      //   model: 'Users',
      //   key: 'id'
      // },
      allowNull: false
    }

  }, { timestamps: true });
  
  return ActivityInfo;
};