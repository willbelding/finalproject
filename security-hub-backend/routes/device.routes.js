const { authJwt } = require("../middleware");
const controller = require("../controllers/device.controller");

module.exports = function (app) {
  app.post("/api/device/register", authJwt.verifyToken, controller.registerDevice);
  app.get("/api/device/list", authJwt.verifyToken, controller.getDevices);
  app.put("/api/device/update/:id", authJwt.verifyToken, controller.updateDeviceStatus);
  app.post("/api/device/scan/:id", authJwt.verifyToken, controller.scanDevice);
  app.post("/api/device/scan", authJwt.verifyToken, controller.submitScanFromMobile);
  app.delete("/api/device/delete/:id", authJwt.verifyToken, controller.deleteDevice);
};