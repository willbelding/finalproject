// In this file, API routes are set up to help carried out user
// authentication and other account management procedures.
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authJwt");

module.exports = function(app) {
  app.post("/api/auth/signup", controller.signup); // When the user want to create a new account.
  app.post("/api/auth/signin", controller.signin); // When the user wants to sign in to their account.
  app.get("/api/auth/profile", authJwt.verifyToken, controller.getProfile); // Helps retrieve profile information.
  app.put("/api/auth/update-email", verifyToken, controller.updateEmail); //When the user updates their email.
  app.put("/api/auth/update-password", verifyToken, controller.updatePassword); // When the user changes their password.
};