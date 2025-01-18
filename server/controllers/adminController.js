const userModel = require("../models/userModel");
const { signUpSchema } = require("./userController/Validation");
const { hashPassword, matchPassword } = require("../utils/password");
const { createToken } = require("../utils/token");
const Request = require("../models/requestSchema");

const adminSignup = async (req, res) => {
	try {
		// const { error } = signUpSchema.validate(req.body);
		// if (error)
		// 	return res.status(400).json({ message: "Schema Validation Failed" });

		const existingUser = await userModel.findOne({ email: req.body.email });
		if (existingUser) {
			return res
				.status(409)
				.json({ message: "User already exists, please log in" });
		}

		/*
            super admin is to be verified by a special token it is not dynamically generated
            at least for now we may shift to some more secure method later
        */

		if (req.body.role !== "admin") {
			return res
				.status(403)
				.json({ message: "You are not authorized to access this route!" });
		}

		hash = await hashPassword(req.body.password);
		console.log(req.body);

		const newUser = new userModel({
			Name: req.body.Name,
			email: req.body.email,
			password: hash,
			rollNumber: req.body.rollNumber ? req.body.rollNumber : 0,
			role: "admin",
			isApproved: true,
		});

		const savedUser = await newUser.save();
		const token = createToken(savedUser._id, savedUser.role);

		res.status(200).json({
			meesage: "User Created",
			savedUser,
			token,
		});
	} catch (err) {
		console.log(err);
		res
			.status(400)
			.json({ message: "An Error Occured Please Try Again Later" });
	}
};

const adminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await matchPassword(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = createToken(user._id, user.role);
		res.status(200).json({ message: "Login successful", user, token });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const getAdminRequests = async (req, res) => {
	try {
		const requests = await Request.getRequests("admin");
		res.json({ message: "success", data: requests });
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const approveRequest = async (req, res) => {
	try {
		const { requestId, feedback } = req.body;
		const request = Request.approveRequest(requestId, feedback);

		res.json({ message: "success", data: request });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const rejectRequest = async (req, res) => {
	try {
		const { requestId, feedback } = req.body;
		const request = Request.rejectRequest(requestId, feedback);

		res.json({ message: "success", data: request });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const deleteRequest = async (req, res) => {
	try {
		const { requestId } = req.body;
		const request = Request.deleteRequest(requestId);

		res.json({ message: "success", data: request });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

module.exports = {
	adminSignup,
	adminLogin,
	approveRequest,
	rejectRequest,
	deleteRequest,
	getAdminRequests,
};
