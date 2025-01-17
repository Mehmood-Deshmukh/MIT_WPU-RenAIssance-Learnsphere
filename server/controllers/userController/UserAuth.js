const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { loginSchema, signUpSchema } = require("./Validation");
const saltRounds = 10;

const createToken = (id) => {
	return jwt.sign(id, process.env.JWTSECRET, { expiresIn: 24 * 60 * 60 });
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
			Name: req.body.name,
			email: req.body.email,
			password: hash,
			rollNumber: req.body.rollNo,
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
		const result = await matchPassword(password, existingUser.password_hash);
		if (!existingUser || !result) {
			return res.status(409).json({ message: "Invalid Credentials" });
		}
		const token = createSecretToken(existingUser._id, existingUser.role);
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
		console.log("Error");
		res.status(401).json({ message: "An Error Occured please try again" });
	}
};

const authenticateUser = (req, res, next) => {
	var token = req.headers?.cookie; // Safely access the token

	if (!token) {
		return res.status(401).send("Access Denied: No Token Provided");
	}

	try {
		const token = req.headers.cookie
			.split("; ")
			.find((item) => item.startsWith("token="))
			?.split("=")[1];
		if (!token) {
			return res.status(401).json({ message: "Access Denied: Token Missing" });
		}

		const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
		req.user = verifiedUser;

	} catch (err) {
		return res.status(403).json({ message: "Invalid Token" });
	}
};

module.exports = { loginUser, signUpUser, authenticateUser };
