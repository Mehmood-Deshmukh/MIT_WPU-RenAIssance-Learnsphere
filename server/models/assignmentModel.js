// raw and temporoary model for assignment
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./userModel");
const courseModel = require("./courseModel");

/*
Few things to note:
1. we need to define the review schema which will be generated by the LLM
2. we need to define the submission schema which will be submitted by the student
3. we need to define the attachment schema which will be uploaded by the teacher
4. we need to consider if the assignment requires a file submission or not.

type Description {
    author: "user" | "llm",
    text: String, // this should most likely be a markdown string
    createdAt: Date,
    updatedAt: Date,
    attachments: Array, // schema for attachments / files needs to be defined
}

raw ideas about review schema:
{
    awardedMarks: Number, // marks awarded by the LLM
    description: {
        type: Description,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: {} // not sure may be little complex
}

we can implement a mechanism where user can raise a request for re-evaluation with some comments,
again not sure but will be a good feature to have.

raw ideas about submission schema:

{
    response: {
        // This can be a text response or a file submission need to figure out how to manage this
    },
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    
    ... more fields to be added
}
*/

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    maxMarks: {
        type: Number,
        required: true,
    },
    attachments: {
        type: [Schema.Types.ObjectId],
        ref: "Attachment",
    },
    createdBy: {
        type: String,
        required: true,
    },
    submissions: {
        type: Array, // schema for submissions needs to be defined
    },
    course:{
        type: Schema.Types.ObjectId,
        ref: courseModel,
        required: true,
    },

    rubrick : {
        type: Object,
        required: true,
    },
    /*
    this is "not sure" field teacher can specify a buffer time for submission although assignment should
    be marked as late after the deadline
    */
    buffer:{ 
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Assignment", assignmentSchema);