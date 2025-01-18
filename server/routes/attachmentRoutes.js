const express = require('express');
const router = express.Router();
const { fileController } = require('../controllers/attachmentController');
const authenticateUser = require('../middlewares/authenticateUser');
const multer = require("multer");
const upload = multer();


router.post('/upload', upload.single("file"), authenticateUser, fileController.uploadFile);
router.get('/:fileId', authenticateUser,fileController.getFile);
router.get('/assignment/:assignmentId', authenticateUser, fileController.getAssignmentFiles);
router.delete('/:fileId', authenticateUser, fileController.deleteFile);

module.exports = router;