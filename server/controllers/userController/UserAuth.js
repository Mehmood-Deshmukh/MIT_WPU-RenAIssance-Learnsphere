const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { loginSchema, signUpSchema } = require("./Validation");
const saltRounds = 10;

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWTSECRET, {
    expiresIn: 24 * 60 * 60,
  });
};

const hashPassword = async (password) => {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		if (!hash) return;
		
		return hash;
	} catch (err) {
		console.log(err);
		return;
	}
};
const matchPassword = async (password, hashed_password) => {
  try {
    const result = await bcrypt.compare(password, hashed_password);
    return result;
  } catch (err) {
    console.log("Invalid Password");
    return false;
  }
};

const signUpUser = async (req, res) => {
  try {
    const { error } = signUpSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: "Schema Validation Failed" });

    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please log in" });
    }
    hash = await hashPassword(req.body.password);
    const newUser = new userModel({
      Name: req.body.Name,
      email: req.body.email,
      password: hash,
      rollNumber: req.body.rollNumber,
      role: req.body.role ? req.body.role : "student",
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser._id, savedUser.role);

    res.cookie("token", token, {
      path: "/", // Accessible across the app
      httpOnly: false, // Prevent client-side access
      secure: false, // Use `true` only for HTTPS
      sameSite: "Lax", // Allow basic cross-origin
      expire: new Date(Date.now() + 28800000),
    });
    return res.status(200).json({ savedUser, token });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "An Error Occured Please Try Again Later" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `Validation error: ${error.details[0].message}` });
    }
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (!existingUser) return res.status(404).send("User Not Found");
    const password = req.body.password;
    const result = await matchPassword(password, existingUser.password);
    if (!existingUser || !result) {
      return res.status(409).json({ message: "Invalid Credentials" });
    }
    const token = createToken(existingUser._id, existingUser.role);
    res.cookie("token", token, {
      path: "/", // Accessible across the app
      httpOnly: false, // Prevent client-side access
      secure: false, // Use `true` only for HTTPS
      sameSite: "Lax", // Allow basic cross-origin
      expires: new Date(Date.now() + 28800000), // Cookie will be removed after 8 hours
    });

    console.log("Logged IN!");
    res.json(existingUser);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "An Error Occured please try again" });
  }
};

module.exports = { loginUser, signUpUser };
