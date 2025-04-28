// This section is resonsible for handling JWT token verification
// middleware for routes that are protected.
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  // A check is carried out on the x-access-token.
  const token = req.headers["x-access-token"];
  // If the token is not valid, an error message is displayed.
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  // A authorisation check is carried out on the JWT token.
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorised Access!" });
    }
    // Otherwise, the userId is added to req.
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };