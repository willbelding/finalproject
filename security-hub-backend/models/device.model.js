module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define("device", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    deviceName: {
      type: Sequelize.STRING
    },
    deviceType: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "Not scanned"
    },
    lastScanned: {
      type: Sequelize.DATE
    },
    scanReport: {
      type: Sequelize.TEXT
    },
    userId: {
      type: Sequelize.INTEGER
    }
  });

  return Device;
};