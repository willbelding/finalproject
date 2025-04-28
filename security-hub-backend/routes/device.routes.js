// In this file, API routes are set up for CRUD procedures
// and scan operations.
const { authJwt } = require("../middleware");
const controller = require("../controllers/device.controller");

module.exports = function (app) {
  app.post("/api/device/register", authJwt.verifyToken, controller.registerDevice); // Confirming registration of account.
  app.get("/api/device/list", authJwt.verifyToken, controller.getDevices); // Retrieving the list of devices with an account.
  app.put("/api/device/update/:id", authJwt.verifyToken, controller.updateDeviceStatus); // Updating the security status of devices.
  app.post("/api/device/scan", authJwt.verifyToken, controller.submitScanFromMobile); // Scan results submission from device.
  app.delete("/api/device/delete/:id", authJwt.verifyToken, controller.deleteDevice); // Deleting device from account.
};