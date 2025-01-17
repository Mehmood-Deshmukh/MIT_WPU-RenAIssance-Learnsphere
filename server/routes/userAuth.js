const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const {
  loginUser,
  signUpUser,
  authenticateUser,
} = require("../controllers/userController/UserAuth");

router.route("/login").post(loginUser);
router.route("/signup").post(signUpUser);

router.get("/logout", (req, res) => {
  res.cookie("token", "none", {
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 1000),
  });

  res.status(200).json({ message: "Logged Out" });
});

router.route("/authenticate-user").post(authenticateUser, async (req, res) => {
  console.log(req.user.id);
  const foundUser = await userModel.findById(req.user.id);
  res.status(200).json(foundUser);
});

module.exports = router;
