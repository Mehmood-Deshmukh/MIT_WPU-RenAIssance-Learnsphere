const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Course = require("./courseModel");
const User = require("./userModel");

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
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requestedTo: {
        type: String,
        enum: ["admin", "teacher"],
        default: "admin"
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
    const CourseCreationRequest = this.discriminators.CourseCreationRequest;
    return CourseCreationRequest.create({
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
    const CourseEnrollmentRequest = this.discriminators.CourseEnrollmentRequest;
    return CourseEnrollmentRequest.create({
        type: "COURSE_ENROLLMENT",
        requestedBy,
        course,
    });
};

Request.approveRequest = async function (requestId, feedback) {
    console.log("Approve Request:", requestId, feedback);
    const request = await this.findById(requestId);
    if (!request) {
        throw new Error("Request Not Found");
    }

    if (request.status !== "PENDING") {
        throw new Error("Request Already Processed");
    }

    request.status = "APPROVED";
    request.feedback = feedback;
    await request.save();

    if (request.type === "COURSE_CREATION") {
        const course = await Course.findById(request.course);
        course.isApproved = true;
        await course.save();
    }

    if (request.type === "TEACHER_SIGNUP") {
        const user = await User.findById(request.requestedBy);
        if (!user) {
            throw new Error("User Not Found");
        }

        user.isApproved = true;
        await user.save();
    }

    return request;
};

Request.approveCourseEnrollment = async function (requestId, feedback) {
    const request = await this.findById(requestId);
    if (!request) {
        throw new Error("Request Not Found");
    }

    if (request.status !== "PENDING") {
        throw new Error("Request Already Processed");
    }

    request.status = "APPROVED";
    request.feedback = feedback;
    await request.save();

    const course = await Course.findById(request.course);
    course.students.push(request.requestedBy);
    await course.save();

    return request;
};

Request.rejectRequest = async function (requestId, feedback) {
    const request = await this.findById(requestId);
    if (!request) {
        throw new Error("Request Not Found");
    }

    if (request.status !== "PENDING") {
        throw new Error("Request Already Processed");
    }

    request.status = "REJECTED";
    request.feedback = feedback;
    await request.save();

    if(request.type === "COURSE_CREATION") {
        const course = await Course.findById(request.course);
        course?.remove();
    }

    if(request.type === "TEACHER_SIGNUP") {
        const user = await User.findById(request.requestedBy);
        user?.remove();
    }
    return request;
};

Request.deleteRequest = async function (requestId) {
    const request = await this.findById(requestId);
    if (!request) {
        throw new Error("Request Not Found");
    }

    await request.remove();
};

Request.getRequests = async function (requestedTo) {
    return this.find({ requestedTo }).sort({ createdAt: -1 }).populate("requestedBy", "name email");
}

module.exports = Request;
