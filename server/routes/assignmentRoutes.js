
const express = require('express');
const { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment, getAssignmentsByCourseID } = require('../controllers/assignmentController');
const authenticateUser = require('../middlewares/authenticateUser');
const verifyRole = require('../middlewares/verifyRole');
const router = express.Router();

// note that this route will only return assignments created by particular teacher
router.get('/', authenticateUser, verifyRole('teacher'), getAssignments);
router.get('/a/:id', getAssignmentById);
router.get("/get-assignments-by-course-id/:id", authenticateUser, getAssignmentsByCourseID);
router.post('/create-assignment', authenticateUser, verifyRole('teacher'), createAssignment);
router.put('/update-assignment/:id', authenticateUser, verifyRole('teacher'), updateAssignment);
router.delete('/delete-assignment/:id', authenticateUser, verifyRole('teacher'), deleteAssignment);

module.exports = router;