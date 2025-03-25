module.exports = (sequelize, Sequelize) => {
    const Device = sequelize.define("device", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      deviceName: {
        type: Sequelize.STRING
      },
      deviceType: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Healthy"
      },
      lastScanned: {
        type: Sequelize.DATE
      }
    });
  
    return Device;
  };