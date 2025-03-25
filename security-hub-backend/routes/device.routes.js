const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/device.controller");

module.exports = function(app) {
  app.post("/api/device/register", verifyToken, controller.registerDevice);
  app.get("/api/device/list", verifyToken, controller.getDevices);
  app.put("/api/device/update/:id", verifyToken, controller.updateDeviceStatus);
  app.post("/api/device/scan/:id", verifyToken, controller.scanDevice);
};