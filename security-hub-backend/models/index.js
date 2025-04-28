// This file initialises Sequelize and configures the relationship
// between models. 
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    pool: dbConfig.pool
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// This section defines all of my models through my existing file
// structure in the models folder.
db.user = require("./user.model.js")(sequelize, Sequelize);
db.device = require("./device.model.js")(sequelize, Sequelize);
db.malware = require("./malware.model.js")(sequelize,Sequelize);
db.scanHistory = require("./ScanHistory.js")(sequelize, Sequelize);

console.log('db.scanHistory loaded:', typeof db.scanHistory?.create);
// This defines that a user can have many devices.
db.user.hasMany(db.device, { as: "devices" });
// This defines that any given device can only belong to one user.
db.device.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user"
});
module.exports = db;