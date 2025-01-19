const mongoose = require('mongoose');
const Assignment = require('../models/assignmentModel');
const Attachment = require('../models/attachmentModel');
const User = require('../models/userModel');
const pdfParse = require('pdf-parse');
const reviewModel = require('../models/reviewModel');

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


            const user = await User.findById(req.user.id);

            if(user.assignments.includes(assignmentId)){
                const attachmentIndex = user.attachments.findIndex(attachment => attachment.assignmentId.toString() === assignmentId);
                user.attachments[attachmentIndex].attachmentId = savedAttachment._id;
            }else{
                user.assignments.push(assignmentId);
                user.attachments.push({assignmentId: assignmentId, attachmentId: savedAttachment._id});
            }

            await user.save();

            return res.status(200).json({
                message: 'File uploaded successfully',
                data:{
                    user: user,
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

            const assignment = await Assignment.findById(assignmentId).populate({
                path: 'attachments',
                populate: {
                  path: 'uploadedBy',
                  select: 'Name email' 
                }
              });
            if (!assignment) {
                return res.status(404).json({ message: 'Assignment not found' });
            }

            return res.json(assignment.attachments);


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
    },
    getTextFromFiles: async (req, res) => {
        try {
            const { fileId } = req.params;
            
            if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }
    
            const attachment = await Attachment.findOne({ _id: new mongoose.Types.ObjectId(fileId) });
            if (!attachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
    
            if (attachment.mimetype !== 'application/pdf') {
                return res.status(400).json({ message: 'Only PDF files are supported' });
            }
    
            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: 'uploads'
            });
    
            // Get PDF buffer
            const pdfBuffer = await new Promise((resolve, reject) => {
                const chunks = [];
                const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(attachment.path));
                
                downloadStream.on('data', (chunk) => chunks.push(chunk));
                downloadStream.on('error', reject);
                downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
            });
    
            const data = await pdfParse(pdfBuffer);
            const text = data.text;

            if (text.trim().length > 0) {
                return res.json({
                    success: true,
                    method: 'pdfParse',
                    text: text.trim()
                });
            }
        } catch (error) {
            console.error('Error in getTextFromFiles:', error);
            return res.status(500).json({
                success: false,
                message: 'Error processing file'
            });
        }
    },
    saveAIReview: async (req, res) => {
        try {
            console.log(req.body);
            const { attachmentId, review } = req.body;
            console.log(attachmentId, review);
            if (!attachmentId || !mongoose.Types.ObjectId.isValid(attachmentId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }

            const savedReview = new reviewModel({
                evalScore: review.evalScore,
                criteriaScore: review.criteriaScore,
                suggestions: review.suggestions,
                sections: review.sections,
                areasOfImprovement: review.areasOfImprovement,
                attachmentId: attachmentId
            });

            await savedReview.save();

    
            const attachment = await Attachment.findOne({ _id: new mongoose.Types.ObjectId(attachmentId) });
            if (!attachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
    
            attachment.aiReview = savedReview._id;
            await attachment.save();
    
            return res.json({ message: 'Review saved successfully' });
        } catch (error) {
            console.error('Error in saveAiReview:', error);
            return res.status(500).json({ message: 'Error saving review' });
        }
    },
    getAIReview: async (req, res) => {
        try {
            const { fileId } = req.params;
            if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
                return res.status(400).json({ message: 'Invalid file ID' });
            }
    
            const attachment = await Attachment.findOne({ _id: new mongoose.Types.ObjectId(fileId) });
            if (!attachment) {
                return res.status(404).json({ message: 'Attachment not found' });
            }
    
            if (!attachment.aiReview) {
                return res.status(404).json({ message: 'Review not found' });
            }
    
            const review = await reviewModel.findOne({ _id: attachment.aiReview });
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
    
            return res.json({
                evalScore: review.evalScore,
                criteriaScore: review.criteriaScore,
                suggestions: review.suggestions,
                sections: review.sections,
                areasOfImprovement: review.areasOfImprovement
            });
        } catch (error) {
            console.error('Error in getAiReview:', error);
            return res.status(500).json({ message: 'Error getting review' });
        }
    }
};

module.exports = { fileController };