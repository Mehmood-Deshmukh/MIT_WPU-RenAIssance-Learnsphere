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
    getAllCourses
} = require("../controllers/courseController");

const authenticateUser = require("../middlewares/authenticateUser");

router.post("/create", authenticateUser, createCourse);
router.get("/instructor/:instructorId", authenticateUser, getCoursesByInstructor);
router.post("/enroll-student/:courseId",authenticateUser, isCourseApproved, enrollStudent);
router.get("/enrollment-requests/:instructorId", authenticateUser, getEnrollmentRequests);
router.post("/approve-enrollment-request/:courseId", authenticateUser,  isCourseApproved, approveEnrollmentRequest);
router.get("/assignments/:courseId", authenticateUser, isCourseApproved, getCourseAssignments);
router.get("/getAllCourses", authenticateUser, getAllCourses);

module.exports = router;