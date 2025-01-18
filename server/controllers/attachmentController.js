const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const mongodb = require("mongodb");
const path = require('path');
const Assignment = require('../models/assignmentModel');


const fileController = {
    uploadFile: async (req, res) => {
        console.log(req.files)
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

            const bucket = new mongodb.GridFSBucket(db, {
                bucketName: "uploads",
            });


            
            await Assignment.findByIdAndUpdate(
                assignmentId,
                { $push: { attachments: req.file.id } }
            );

            console.log("here");

            res.status(201).json({
                message: 'File uploaded successfully',
                file: {
                    id: req.file.id,
                    filename: req.file.originalname,
                    size: req.file.size,
                    contentType: req.file.contentType,
                    uploadDate: req.file.uploadDate
                }
            });
        } catch (error) {
            console.error('File upload error:', error);
            res.status(500).json({ message: 'Error uploading file' });
        }
    },

    getFile: async (req, res) => {
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

            
            const chunks = [];
            const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

            downloadStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            downloadStream.on('error', () => {
                res.status(404).json({ message: 'Error retrieving file' });
            });

            downloadStream.on('end', () => {
                const fileData = Buffer.concat(chunks);
                
                let content;
                if (file.metadata.contentType.startsWith('text/')) {
                    content = fileData.toString('utf8');
                } else {
                    content = fileData.toString('base64');
                }

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
            });
        } catch (error) {
            console.error('Error getting file:', error);
            res.status(500).json({ message: 'Error retrieving file' });
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
        } catch (error) {
            console.error('Error getting assignment files:', error);
            res.status(500).json({ message: 'Error retrieving assignment files' });
        }
    },

    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });

            await bucket.delete(new mongoose.Types.ObjectId(fileId));

            await Assignment.updateMany(
                { attachments: fileId },
                { $pull: { attachments: fileId } }
            );

            res.json({ message: 'File deleted successfully' });
        } catch (error) {
            console.error('Error deleting file:', error);
            res.status(500).json({ message: 'Error deleting file' });
        }
    }
};

module.exports = { fileController };