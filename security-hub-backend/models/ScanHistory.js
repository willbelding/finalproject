// This file defines all the contents of a record in the Scan History
// section of the application.
module.exports = (sequelize, DataTypes) => {
  const ScanHistory = sequelize.define("ScanHistory", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scanResult: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
  return ScanHistory;
};