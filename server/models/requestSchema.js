/*
    Not sure if this is the way to implement this. This is the schema for the request object.
    whenever teacher would want to create a new course, or a new teacher wants to signup for the platform,
    they would send a request object to the admin. The admin can then approve or reject the request.
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const requestSchema = new Schema({
    // this will probably be the type of request
    type: {
        type: String,
        enum: ["COURSE_CREATION", "TEACHER_SIGNUP", "COURSE_ENROLLMENT" ], // more types can be added
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
    // whoever is writing api for this remember to make sure there is expiry date for the request
    // so that the request can be deleted after a certain time
    // for deletion of expired requests, we may have to write a cron job
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const courseCreationRequestSchema = new Schema({
    // this will be the id of the teacher who wants to create the course
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }
});

const teacherSignupRequestSchema = new Schema({
    // this will be the id of the teacher who wants to signup
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const courseEnrollmentRequestSchema = new Schema({
    // this will be the id of the student who wants to enroll in the course
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    }
});

module.exports = mongoose.model("Request", requestSchema);

requestSchema.discriminator("CourseCreationRequest", courseCreationRequestSchema);
requestSchema.discriminator("TeacherSignupRequest", teacherSignupRequestSchema);
requestSchema.discriminator("CourseEnrollmentRequest", courseEnrollmentRequestSchema);


requestSchema.statics.createCourseCreationRequest = async function (requestedBy, course) {
    return this.create({
        type: "COURSE_CREATION",
        requestedBy,
        course,
    });
}

requestSchema.statics.createTeacherSignupRequest = async function (requestedBy) {
    return this.create({
        type: "TEACHER_SIGNUP",
        requestedBy,
    });
}

requestSchema.statics.createCourseEnrollmentRequest = async function (requestedBy, course) {
    return this.create({
        type: "COURSE_ENROLLMENT",
        requestedBy,
        course,
    });
}