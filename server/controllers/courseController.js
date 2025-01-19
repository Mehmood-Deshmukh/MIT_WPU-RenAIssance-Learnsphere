const Course = require("../models/courseModel");
const Request = require("../models/requestSchema");
const userModel = require("../models/userModel");
const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const isCourseApproved = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (!course.isApproved) {
      throw new Error("Course is not approved yet");
    }

    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("assignments");
    console.log("course", course);
    if (!course) {
      throw new Error("Course not found");
    }

    res.status(201).json({
      message: "Success!",
      data: course,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, createdBy, instructors } = req.body;

    const course = new Course({
      title,
      description,
      createdBy,
      instructors: [...(instructors?.length ? instructors : []), createdBy],
    });

    await course.save();

    const request = await Request.createCourseCreationRequest(
      createdBy,
      course._id
    );
    await request.save();

    res.json({
      message: "Request for course creation sent for approval",
      data: course,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = await Course.find({
      instructors: { $in: [instructorId] },
    }).sort({ createdAt: -1 });

    res.json({ message: "success", data: courses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const request = await Request.createCourseEnrollmentRequest(
      studentId,
      courseId,
      course.instructors
    );
    await request.save();

    res.json({
      message: "Request for course enrollment sent for approval",
      data: course,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getEnrollmentRequests = async (req, res) => {
  try {
    const { instructorId, courseId } = req.query;
    const myObjID = new mongoose.Types.ObjectId(courseId);
    console.log(instructorId, courseId);
    try {
      const currCourse = await Course.findOne({ _id: courseId });
      if (!currCourse.instructors.includes(instructorId)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to view this course" });
      }
      let requests = await Request.find({
        type: "COURSE_ENROLLMENT",
      })
        .populate("requestedBy")
        .sort({ createdAt: -1 });
      requests = requests.filter((request) => {
        return request.course.toString() == courseId;
      });
      res.json({ message: "success", data: requests });
    } catch (e) {
      res.json({ message: "success", data: [] });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const approveEnrollmentRequest = async (req, res) => {
  try {
    const { requestId, feedback } = req.body;
    const request = Request.approveCourseEnrollment(requestId, feedback);

    res.json({ message: "success", data: request });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("assignments");

    res.json({ message: "success", data: course.assignments });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getAllStudentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const students = await userModel.find({ _id: { $in: course.students } });
    res.json({ message: "success", data: students });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: true });

    res.json({ message: "success", data: courses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getAllUserCourses = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("courses");
    const courses = user.courses;

    res.json({ message: "success", data: courses });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// rememeber to check is isApproved field of course is true or not
module.exports = {
  getCourse,
  isCourseApproved,
  createCourse,
  getCoursesByInstructor,
  enrollStudent,
  getEnrollmentRequests,
  approveEnrollmentRequest,
  getCourseAssignments,
  getAllCourses,
  getAllStudentsForCourse,
  getAllUserCourses,
};
