const express = require("express");
const router = express.Router();

const {
  getCourse,
  isCourseApproved,
  createCourse,
  getCoursesByInstructor,
  enrollStudent,
  getEnrollmentRequests,
  approveEnrollmentRequest,
  getCourseAssignments,
  getAllCourses,
  getAllStudentsForCourse,
} = require("../controllers/courseController");

const authenticateUser = require("../middlewares/authenticateUser");

router.post("/create", authenticateUser, createCourse);
router.get("/get-course/:courseId", isCourseApproved, getCourse);
router.get(
  "/instructor/:instructorId",
  authenticateUser,
  getCoursesByInstructor
);
router.post(
  "/enroll-student/:courseId",
  authenticateUser,
  isCourseApproved,
  enrollStudent
);
router.get(
  "/enrollment-requests/:instructorId",
  authenticateUser,
  getEnrollmentRequests
);
router.post(
  "/approve-enrollment-request/:courseId",
  authenticateUser,
  isCourseApproved,
  approveEnrollmentRequest
);
router.get(
  "/assignments/:courseId",
  authenticateUser,
  isCourseApproved,
  getCourseAssignments
);
router.get("/getAllCourses", authenticateUser, getAllCourses);

router.get(
  "/getAllStudentsForCourse/:courseId",
  authenticateUser,
  isCourseApproved,
  getAllStudentsForCourse
);

module.exports = router;
