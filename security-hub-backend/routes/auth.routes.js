const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function(app) {
  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/profile", authJwt.verifyToken, controller.getProfile);
  app.put("/api/auth/update-email", verifyToken, controller.updateEmail);
  app.put("/api/auth/update-password", verifyToken, controller.updatePassword);
};