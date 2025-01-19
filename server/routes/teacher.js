const express = require("express");
const router = express.Router();

const {
    getAllTeachers,
    getTeacherRequests,
    getTeacherById,
    getTeacherBySubject,
    getTeacherAssignments,
    approveCourseEnrollment,
} = require("../controllers/teacherController");


router.get("/get-all-teachers", getAllTeachers);
router.get("/get-teacher-requests/", getTeacherRequests);
router.get("/get-teacher-by-id/:instructorId", getTeacherById);
router.post("/get-teacher-by-subject/", getTeacherBySubject);
router.get("/get-teacher-assignments/:instructorId", getTeacherAssignments);
router.post("/approve-course-enrollment/:courseId", approveCourseEnrollment);

module.exports = router;