// This file defines all the elements of the Device table for
// Sequelize ORM.
module.exports = (sequelize, Sequelize) => {
  const Device = sequelize.define("device", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    deviceName: { // In my testing, this could be "Will's S22 Ultra".
      type: Sequelize.STRING
    },
    deviceType: { // In my testing, this could be "handset".
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