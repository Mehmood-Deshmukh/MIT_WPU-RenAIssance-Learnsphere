const Request = require("../models/requestSchema");
const User = require("../models/userModel");
const Course = require("../models/courseModel");


const getAllRequests = async (req, res) => {
    try{
        const requests = await Request.find();
        res.json({message: "success", data: requests});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const getRequestById = async (req, res) => {
    try{
        const request = await Request.findById(req.params.id);
        res.json({message: "success", data: request});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const approveRequest = async (req, res) => {
    try{
        const {requestId, feedback} = req.body;
        const request = await Request.findById(requestId);
        if(!request) {
            return res.status(404).json({message: "Request Not Found"});
        }

        if(request.status !== "PENDING") {
            return res.status(400).json({message: "Request Already Processed"});
        }

        request.status = "APPROVED";
        request.feedback = feedback;
        await request.save();

        if(request.__t === "CourseCreationRequest") {
            const course = await Course.findById(request.course);
            course.instructors.push(request.requestedBy);
            await course.save();
        }
        
        if(request.__t === "TeacherSignupRequest") {
            const user = await User.findById(request.requestedBy);
            if(!user) {
                return res.status(404).json({message: "User Not Found"});
            }

            user.isApproved = true;
            await user.save();
        }
        res.json({message: "success", data: request});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const approveCourseEnrollmentRequest = async (req, res) => {
    try{
        const {requestId, feedback} = req.body;
        const request = await Request.findById(requestId);
        if(!request) {
            return res.status(404).json({message: "Request Not Found"});
        }

        if(request.status !== "PENDING") {
            return res.status(400).json({message: "Request Already Processed"});
        }

        request.status = "APPROVED";
        request.feedback = feedback;

        const course = await Course.findById(request.course);
        course.students.push(request.requestedBy);
        await course.save();
        await request.save();
        res.json({message: "success", data: request});
    }
    catch(e) {
        res.status(500).json({message: e.message});
    }
}

const rejectRequest = async (req, res) => {
    try{
        const {requestId, feedback} = req.body;
        const request = await Request.findById(requestId);
        if(!request) {
            return res.status(404).json({message: "Request Not Found"});
        }

        if(request.status !== "PENDING") {
            return res.status(400).json({message: "Request Already Processed"});
        }

        request.status = "REJECTED";
        request.feedback = feedback;
        await request.save();
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = {
    getAllRequests,
    getRequestById,
    approveRequest,
    approveCourseEnrollmentRequest,
    rejectRequest
}