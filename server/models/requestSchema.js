const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    type: {
        type: String,
        enum: ["COURSE_CREATION", "TEACHER_SIGNUP", "COURSE_ENROLLMENT"],
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },
    feedback: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const courseCreationRequestSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
});

const teacherSignupRequestSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const courseEnrollmentRequestSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
});

const Request = mongoose.model("Request", requestSchema);

Request.discriminator("CourseCreationRequest", courseCreationRequestSchema);
Request.discriminator("TeacherSignupRequest", teacherSignupRequestSchema);
Request.discriminator("CourseEnrollmentRequest", courseEnrollmentRequestSchema);

Request.createCourseCreationRequest = async function (requestedBy, course) {
    return this.create({
        type: "COURSE_CREATION",
        requestedBy,
        course,
    });
};

Request.createTeacherSignupRequest = async function (requestedBy) {
    return this.create({
        type: "TEACHER_SIGNUP",
        requestedBy,
    });
};

Request.createCourseEnrollmentRequest = async function (requestedBy, course) {
    return this.create({
        type: "COURSE_ENROLLMENT",
        requestedBy,
        course,
    });
};

module.exports = Request;
