const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model("User");

const courseSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	assignments: {
		type: [Schema.Types.ObjectId],
		ref: "Assignment",
	},
	instructors: {
		type: [Schema.Types.ObjectId],
		ref: "User",
		validate: {
			validator: function (v) {
				return v.every(async (id) => {
					return User.findById(id).then((user) => user.role === "teacher");
				});
			},
			message: (props) =>
				`One or more instructors do not have the role of teacher`,
		},
	},
	students: {
		type: [Schema.Types.ObjectId],
		ref: "User",
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Course", courseSchema);