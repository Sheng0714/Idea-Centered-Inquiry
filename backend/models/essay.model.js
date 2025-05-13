module.exports = (sequelize, DataTypes) => {
  const Essay = sequelize.define("Essay", {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activityId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, { timestamps: true });

  return Essay;
};