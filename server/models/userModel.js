const mongoose = require("mongoose");
const Attachment = require("./attachmentModel");
const courseModel = require("./courseModel");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	Name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Please Provide A Valid Email Address",
		],
	},
	password: {
		type: String,
		required: true,
	},
	/*
		we may need to specify seperate schema for role
		where we can define all the roles and their permissions
	*/
	role: {
		type: String,
		enum: ["student", "teacher", "admin"],
		required: true,
		default: "student",
	},
	rollNumber: {
		type: Number,
		required: true,
	},
	assignments: {
		type: [Schema.Types.ObjectId],
		ref: "Assignment",
	},
	attachments: {
		/* two fields assignmentId and attachmentID like a json object */
		type: [
			{
				assignmentId: {
					type: Schema.Types.ObjectId,
					ref: "Assignment",
					required: true,
				},
				attachmentId: {
					type: Schema.Types.ObjectId,
					ref: "Attachment",
					required: true,
				},
			},
		],
	},

	// following fields are only for teacher
	subjects: {
		type: [String],
		required: function () {
			return this.role === "teacher";
		},
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
	courses: {
		type: [Schema.Types.ObjectId],
		ref: courseModel,
	}

});

module.exports = mongoose.model("User", userSchema);
