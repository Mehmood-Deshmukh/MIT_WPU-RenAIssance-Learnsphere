const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");
const Course = require("../models/courseModel");
const Request = require("../models/requestSchema");

const getAllTeachers = async (req, res) => {
    try{
        const teachers = await User.find({role: 'teacher'});
        res.json({message: "success", data: teachers});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const getTeacherRequests = async (req, res) => {
    try{
        const requests = await Request.getRequests("teacher");
        res.json({message: "success", data: requests});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const getTeacherById = async (req, res) => {
    try{
        const teacher = await User.findById(req.params.id);
        res.json({message: "success", data: teacher});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const getTeacherBySubject = async (req, res) => {
    try{
        const teachers = await User.find({role: 'teacher', subjects: req.params.subject});
        res.json({message: "success", data: teachers});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const getTeacherAssignments = async (req, res) => {
    try{
        const assignments = await Assignment.find({createdBy: req.user._id});
        res.json({message: "success", data: assignments});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

const approveCourseEnrollment = async (req, res) => {
    try{
        const {courseId, feedback} = req.body;
        const request = Request.approveCourseEnrollment(courseId, feedback);

        res.json({message: "success", data: request});
    }catch(e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    getTeacherBySubject,
    getTeacherAssignments,
    approveCourseEnrollment,
    getTeacherRequests
};