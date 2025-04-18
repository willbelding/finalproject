const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    await User.create({
      email: req.body.email,
      password: hashedPassword
    });
    res.status(200).send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid)
      return res.status(401).send({ message: "Invalid Password!" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send({ email: user.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: "Incorrect password" });

    user.email = req.body.newEmail;
    await user.save();
    res.send({ message: "Email updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const isPasswordValid = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: "Incorrect current password" });

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();
    res.send({ message: "Password updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};