const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    evalScore: {
        type: Number,
        required: true,
    },
    criteriaScore: {
        type: Map, // map allows dynamic keys
        of: Number, // Values in the Map should be of type Number
        required: true, // Ensures `criteriaScore` is mandatory
    },
    suggestions: {
        type : [String,],
        required : true
    },
    sections: {
        type: [String,],
        required: true,
    },
    areasOfImprovement : {
        type : [String,],
        required : true
    },
    submissionID: {
        type: Schema.Types.ObjectId,
        // ref : Submission // Need Submission Model
        required: true
    }
});

module.exports = mongoose.model("Review", reviewSchema);