const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rubrickSchema = new Schema({
    assignmentTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String, // map allows dynamic keys
        required: true, // Ensures `criteriaScore` is mandatory
    },
    assignmentType: {
        type : String,
        required : true
    },
    markingScheme: {
            type : Number,
            required : true
    },
    emphasisPoints : {
        type : Map,
        of : Number,
        required : true
    },
    strictness : {
        type : Number,
        required : true
    },
    submissionID: {
        type: Schema.Types.ObjectId,
        // ref : Submission // Need Submission Model
        required : true
    }
});

module.exports = mongoose.model("Rubrick", reviewSchema);