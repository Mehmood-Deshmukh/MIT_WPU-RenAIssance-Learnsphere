const mongoose = require('mongoose');
const Assignment = require('../models/assignmentModel');
const Attachment = require('../models/attachmentModel');

const fileController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { assignmentId } = req.body;
            if (!assignmentId) {
                return res.status(400).json({ message: 'Assignment ID is required' });
            }

            
            const assignment = await Assignment.findById(assignmentId);
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }

            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });

            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                metadata: {
                    originalname: req.file.originalname,
                    contentType: req.file.mimetype,
                    assignmentId: assignmentId,
                    uploadedBy: req.user._id
                }
            });

            uploadStream.write(req.file.buffer);
            uploadStream.end();

            await new Promise((resolve, reject) => {
                uploadStream.on('finish', resolve);
                uploadStream.on('error', reject);
            });



            const attachment = new Attachment({
                filename: req.file.originalname,
                path: uploadStream.id.toString(),
                mimetype: req.file.mimetype,
                size: req.file.size,
                uploadedBy: req.user.id,
                assignmentId: assignmentId
            });

            const savedAttachment = await attachment.save();

            assignment.attachments.push(savedAttachment._id);
            await assignment.save();

            return res.status(201).json({
                message: 'File uploaded successfully',
                attachment: {
                    id: savedAttachment._id,
                    filename: savedAttachment.filename,
                    size: savedAttachment.size,
                    mimetype: savedAttachment.mimetype,
                    uploadedBy: savedAttachment.uploadedBy,
                    createdAt: savedAttachment.createdAt
                }
            });


        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).json({ message: 'Error uploading file' });
        }
    },

    getFile: async (req, res) => {
        let downloadStream;
        try {
            const { fileId } = req.params;
            if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });
            
            const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
            
            if (!files || files.length === 0) {
                return res.status(404).json({ message: 'File not found' });
            }

            const file = files[0];
            
            const fileData = await new Promise((resolve, reject) => {
                const chunks = [];
                downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
                
                downloadStream.on('data', (chunk) => chunks.push(chunk));
                downloadStream.on('error', (error) => reject(error));
                downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
            });

            let content;
            if (file.metadata.contentType.startsWith('text/')) {
                content = fileData.toString('utf8');
            } else {
                content = fileData.toString('base64');
            }

            if (!res.headersSent) {
                res.json({
                    id: file._id,
                    filename: file.filename,
                    originalname: file.metadata.originalname,
                    contentType: file.metadata.contentType,
                    size: file.length,
                    uploadDate: file.uploadDate,
                    content: content,
                    encoding: file.metadata.contentType.startsWith('text/') ? 'utf8' : 'base64'
                });
            }
        } catch (error) {
            console.error('Error getting file:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error retrieving file' });
            }
        } finally {
            if (downloadStream) {
                downloadStream.destroy();
            }
        }
    },

    getAssignmentFiles: async (req, res) => {
        try {
            const { assignmentId } = req.params;
            if (!assignmentId || !mongoose.Types.ObjectId.isValid(assignmentId)) {
                return res.status(400).json({ message: 'Invalid assignment ID' });
            }

            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });

            const files = await bucket
                .find({ 'metadata.assignmentId': assignmentId })
                .toArray();

            if (!res.headersSent) {
                res.json({
                    count: files.length,
                    files: files.map(file => ({
                        id: file._id,
                        filename: file.filename,
                        originalname: file.metadata.originalname,
                        contentType: file.metadata.contentType,
                        size: file.length,
                        uploadDate: file.uploadDate
                    }))
                });
            }
        } catch (error) {
            console.error('Error getting assignment files:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error retrieving assignment files' });
            }
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            // Find the attachment first to ensure it exists
            const attachment = await Attachment.findOne({ path: fileId });
            if (!attachment) {
                return res.status(404).json({ message: 'File not found' });
            }

            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });

            await bucket.delete(new mongoose.Types.ObjectId(fileId));
            
            await Assignment.updateMany(
                { attachments: attachment._id },
                { $pull: { attachments: attachment._id } }
            );

       
            await Attachment.deleteOne({ _id: attachment._id });

            if (!res.headersSent) {
                res.json({ message: 'File deleted successfully' });
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error deleting file' });
            }
        }
    }
};

module.exports = { fileController };