const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");


const getAllTeachers = async (req, res) => {
    try{
        const teachers = await User.find({role: 'teacher'});
        res.json({message: "success", data: teachers});
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

module.exports = {
    getAllTeachers,
    getTeacherById,
    getTeacherBySubject,
    getTeacherAssignments
};