const User = require("../models/userModel");

const adminSignup = async (req, res) => {
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

		/*
            super admin is to be verified by a special token it is not dynamically generated
            at least for now we may shift to some more secure method later
        */
		const _token = req.headers.authorization.split(" ")[1];
		if (_token !== process.env.SUPER_ADMIN_TOKEN) {
			return res
				.status(403)
				.json({ message: "You are not authorized to access this route!" });
		}

		if (req.body.role !== "admin") {
			return res
				.status(403)
				.json({ message: "You are not authorized to access this route!" });
		}

		hash = await hashPassword(req.body.password);
		const newUser = new userModel({
			Name: req.body.Name,
			email: req.body.email,
			password: hash,
			rollNumber: req.body.rollNumber ? req.body.rollNumber : 0,
			role: "admin",
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

const getAdminRequests = async (req, res) => {
	try {
		const requests = await Request.getRequests("admin");
		res.json({ message: "success", data: requests });
	} catch (e) {
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

module.exports = { adminSignup, approveRequest, rejectRequest, deleteRequest, getAdminRequests };
