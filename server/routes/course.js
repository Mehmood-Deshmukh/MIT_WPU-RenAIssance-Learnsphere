const express = require("express");
const router = express.Router();

const {
    isCourseApproved,
    createCourse,
    getCoursesByInstructor,
    enrollStudent,
    getEnrollmentRequests,
    approveEnrollmentRequest,
    getCourseAssignments,
} = require("../controllers/courseController");


router.post("/create", createCourse);
router.get("/instructor/:instructorId", getCoursesByInstructor);
router.post("/enroll-student/:courseId", isCourseApproved, enrollStudent);
router.get("/enrollment-requests/:instructorId", getEnrollmentRequests);
router.post("/approve-enrollment-request/:courseId", isCourseApproved, approveEnrollmentRequest);
router.get("/assignments/:courseId", isCourseApproved, getCourseAssignments);

module.exports = router;