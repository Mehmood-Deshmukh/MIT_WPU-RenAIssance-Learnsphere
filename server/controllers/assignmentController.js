// teacher routes
const Assignment = require("../models/assignmentModel");

const createAssignment = async (req, res) => {
	try {
		// not implemented yet
		// const {error} = createAssignmentSchema.validate(req.body);

		const teacher = req.user;
		const {
			title,
			subject,
			description,
			deadline,
			maxMarks,
			attachments,
			buffer,
		} = req.body;

		const newAssignment = new Assignment({
			title,
			subject,
			description,
			deadline,
			maxMarks,
			attachments,
			createdBy: teacher._id,
			buffer,
		});

		const savedAssignment = await newAssignment.save();
		res.status(201).json({
			message: "Assignment created successfully",
			data: savedAssignment,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: "Internal Server Error", data: null });
	}
};

const getAssignments = async (req, res) => {
    try {
        // schema validation pending

        const assignments = await Assignment.find({ createdBy: req.user._id });
        res.status(200).json({ message: "Assignments fetched successfully", data: assignments });
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error", data: null });
    }
};

const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        res.status(200).json({ message: "Assignment fetched successfully", data: assignment });

    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error", data: null });
    }
}

const updateAssignment = async (req, res) => {
    try {
        // schema validation pending

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found", data: null });
        }

        const { title, subject, description, deadline, maxMarks, attachments, buffer } = req.body;
        assignment.title = title;
        assignment.subject = subject;
        assignment.description = description;
        assignment.deadline = deadline;
        assignment.maxMarks = maxMarks;
        assignment.attachments = attachments;
        assignment.buffer = buffer;

        const updatedAssignment = await assignment.save();
        res.status(200).json({ message: "Assignment updated successfully", data: updatedAssignment });
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error", data: null });
    }
}

const deleteAssignment = async (req, res) => {
    try {
        // schema validation pending

        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found", data: null });
        }

        await assignment.remove();
        res.status(200).json({ message: "Assignment deleted successfully", data: null });
    }catch(e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error", data: null });
    }
}

const getAssignmentsByCourseID = async (req, res) => {
    try {

        const assignments = await Assignment.find({ courseID: req.params.id });
        if(!assignments) {
            return res.status(404).json({"message" : "Course Not Found!", data : null });
        }

        return res.status(200).json({"message" : "Course Found", data : assignments});
    } catch (e) {
    return res.status(500).json({"message" : "Internal server error", data : null});
    }
}



module.exports = { createAssignment, getAssignments, getAssignmentById, updateAssignment, deleteAssignment, getAssignmentsByCourseID };