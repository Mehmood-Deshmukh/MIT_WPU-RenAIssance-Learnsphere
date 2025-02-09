const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewModel = require('./reviewModel');

const attachmentSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    aiReview:{
        type: Schema.Types.ObjectId,
        ref: reviewModel,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Attachment', attachmentSchema);