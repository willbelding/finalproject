const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ScanHistory = sequelize.define('ScanHistory', {
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

module.exports = ScanHistory;