const express = require('express');
const {
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    approveCourseEnrollmentRequest
} = require('../controllers/requestController');
const verifyRole = require('../middlewares/verifyRole');
const authenticateUser = require('../middlewares/authenticateUser');

const router = express.Router();

router.get('/', authenticateUser, verifyRole("admin"), getAllRequests);
router.get('/:id', authenticateUser, verifyRole("admin"), getRequestById);

router.post('/approve', authenticateUser, verifyRole("admin"), approveRequest);
router.post('/approvecourseenrollment', authenticateUser, verifyRole("teacher", "admin"), approveCourseEnrollmentRequest);
router.post('/reject', authenticateUser, verifyRole("admin"), rejectRequest);

module.exports = router;