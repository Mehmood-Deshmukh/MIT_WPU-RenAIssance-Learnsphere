const express = require('express');
const router = express.Router();
const { fileController } = require('../controllers/attachmentController');
const authenticateUser = require('../middlewares/authenticateUser');
const multer = require("multer");
const upload = multer();


router.post('/upload', authenticateUser, upload.array("files", 5), fileController.uploadFile);
router.get('/:fileId', authenticateUser,fileController.getFile);
router.get('/assignment/:assignmentId', authenticateUser, fileController.getAssignmentFiles);
router.delete('/:fileId', authenticateUser, fileController.deleteFile);

module.exports = router;