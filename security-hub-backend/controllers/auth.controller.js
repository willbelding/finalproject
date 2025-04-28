// This section handles user authentication, registration,
// and management of profiles.
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs"); // This helps ensure password hashing.
const jwt = require("jsonwebtoken"); // This helps create a JWT token for a session.

// This section enables registration of a new user (sign up).
exports.signup = async (req, res) => {
  try {
    // This establishes password hashing.
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    // Saving the user information.
    await User.create({
      email: req.body.email,
      password: hashedPassword
    });
    // Displaying success message when account is created.
    res.status(200).send({ message: "Registration Successful!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// This section enables login functionality (sign in).
exports.signin = async (req, res) => {
  try {
    // Trying to find whether the input information (user) is valid.
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    // If the information doesn't match any records, an error message is displayed.
    if (!user) return res.status(404).send({ message: "User not found" });

    // If the user is valid, then check whether the password matches the account.
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    // If the password entered is not valid, dispay an error message.
    if (!passwordIsValid)
      return res.status(401).send({ message: "Invalid Password!" });

    // If the password matches, then a token is issued.
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400
    });

    // User information is established.
    res.status(200).send({
      id: user.id,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// This handles the retrieval of profile data for a user.
exports.getProfile = async (req, res) => {
  try {
    // This attempts to fetch a user through the token ID.
    const user = await User.findByPk(req.userId);
    // If the token ID doesn't match a user, an error message is displayed.
    if (!user) return res.status(404).send({ message: "User was not found" });
    // Otherwise, the profile data is sent.
    res.send({ email: user.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// This section attempts to help a user change the email address
// associated with their account.
exports.updateEmail = async (req, res) => {
  try {
    // This attempts to fetch the user information through the token ID.
    const user = await User.findByPk(req.userId);
    // If no user is found, an error message is displayed.
    if (!user) return res.status(404).send({ message: "User was not found" });

    // If the user information is retrieved, the password that the user must
    // provide to change their email address is checked for validity. 
    const isPasswordValid = bcrypt.compareSync(req.body.currentPassword, user.password);
    // If it doesn't match the current password of the account, then an error message
    // is displayed.
    if (!isPasswordValid) return res.status(401).send({ message: "Incorrect password" });
    // Otherwise, the users email address is updated and saved.
    user.email = req.body.newEmail;
    await user.save();
    // The user is informed of the successful change.
    res.send({ message: "Email updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// In this section, we follow a similar process for changing of a user password.
exports.updatePassword = async (req, res) => {
  try {
    // The user information is fetched and an error message is displayed
    // if the data can't be found.
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "User was not found" });

    // A check on the whether the provided password matches the current password
    // associated with the account. If the password does not match, an error message
    // is displayed.
    const isPasswordValid = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: "Incorrect password" });
    // Otherwise, the password entered in the "new password" section is saved as the
    // new password for the account with a success message displayed. 
    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();
    res.send({ message: "Password updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};