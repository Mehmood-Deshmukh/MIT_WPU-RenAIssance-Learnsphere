require("dotenv").config();
const express = require("express");
const app = express();
const userAuthRoutes = require("./routes/userAuth");
const attachmentRoutes = require("./routes/attachmentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");
const teacher = require("./routes/teacher");

const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { connectDB } = require("./config/db");
const requestRoutes = require("./routes/request");
const { evaluateAssignment, generateRubrick } = require("./utils/llmUtils");

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    },
  })
);

app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
});

app.use("/api/attachments", attachmentRoutes);
app.use("/auth", userAuthRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/teacher", teacher);

app.get("/", (req, res) => {
  res.send("Welcome");
});

connectDB();





// Handle user input
app.post("/get-eval", async (req, res) => {
  try {
    const rubrick = req.body.rubrick;
    const assignment = req.body.assignment;

    const modelInput = "Rubrick: " + rubrick + " Assignment: " + assignment;
    if (rubrick && assignment) {
      const result = await evaluateAssignment(modelInput);
      return res.status(200).json({ message: "Success", data: result });
    } else {
      return res.status(204).json({ message: "Unsuccessful", data: null });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: null });
  }
});

const generateRoadmapPrompt = (topic) => `
You are an expert programming instructor tasked with creating a detailed learning roadmap. Please analyze the following topic and create a structured learning path. Return the response in the following JSON format:

{
  "roadmapTitle": "Learning Path: [Topic Name]",
  "estimatedTime": "X weeks/months",
  "difficulty": "Beginner/Intermediate/Advanced",
  "prerequisites": [
    {
      "skill": "Required skill/knowledge",
      "description": "Brief explanation of why this is needed"
    }
  ],
  "mainConcepts": [
    {
      "title": "Concept name",
      "timeEstimate": "X hours/days",
      "importance": "Critical/Important/Good to know",
      "description": "Brief explanation of the concept"
    }
  ],
  "learningPhases": [
    {
      "phase": "Phase name (e.g., 'Fundamentals')",
      "duration": "X weeks",
      "topics": [
        {
          "name": "Topic name",
          "description": "What you'll learn",
          "resources": [
            {
              "type": "Documentation/Video/Tutorial/Practice",
              "title": "Resource name",
              "description": "Brief description of the resource"
            }
          ],
          "practiceProjects": [
            {
              "title": "Project name",
              "difficulty": "Easy/Medium/Hard",
              "description": "What to build",
              "keyLearnings": ["Learning point 1", "Learning point 2"]
            }
          ]
        }
      ],
      "milestones": [
        {
          "description": "What you should be able to do after this phase",
          "checkpoints": ["Specific skill 1", "Specific skill 2"]
        }
      ]
    }
  ],
  "additionalResources": [
    {
      "category": "Books/Websites/Tools",
      "resources": [
        {
          "name": "Resource name",
          "description": "Why this resource is helpful"
        }
      ]
    }
  ],
  "nextSteps": [
    {
      "path": "Potential next learning path",
      "description": "Why this could be a good next step"
    }
  ],
  "commonChallenges": [
    {
      "challenge": "Common difficulty students face",
      "solution": "How to overcome it",
      "preventiveTips": ["Tip 1", "Tip 2"]
    }
  ]
}

Topic to create roadmap for: ${topic}

Ensure the roadmap is:
1. Progressive - Concepts build upon each other
2. Practical - Includes hands-on projects and exercises
3. Comprehensive - Covers fundamental to advanced concepts
4. Realistic - Time estimates are practical for self-paced learning
5. Specific - Resources and projects are clearly defined
6. Structured - Clear phases with defined objectives and milestones

The response must strictly follow the JSON format above to ensure proper parsing and display in the application.`;

app.post("/get-roadmap", async (req, res) => {
  try {
    const topic = req.body.topic;
    if (!topic) {
      return res.status(400).json({
        message: "Topic is required",
        data: null,
      });
    }

    const modelInput = generateRoadmapPrompt(topic);
    const result = await evaluateAssignment(modelInput);

    try {
      // Verify the response is valid JSON
      return res.status(200).json({
        message: "Success",
        data: result,
      });
    } catch (parseError) {
      return res.status(422).json({
        message: "Invalid response format",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
    });
  }
});

const rubrick_context = `You are an expert in generating assignment rubrics. Your sole task is to create or refine rubrics based on user-provided assignment details. The rubrics must strictly adhere to the following JSON format: {"assignmentTitle": "string (title of the assignment, chosen by the user or student)", "description": "string (short description of the assignment)" "assignmentType": "string (type of assignment, e.g., 'Essay', 'Research Paper', 'Report')", "markingScheme": "number (grading system, 100, 200)", "emphasisPoints": {"key (string)": "value (integer, points allocated for each emphasis area)", "...additional keys as needed..."}, "strictness": "integer (grading rigor, must be on a scale of 1-10 1 being lenient and 10 being strict)"} Rules for Generating Rubrics: 1. Always include all required fields in the JSON format. 2. Ensure that the 'emphasisPoints' field is a dictionary with appropriate keys (e.g., "Grammar", "Clarity") and values (integer point allocations). The sum of the values must match the total points specified in 'markingScheme'. 3. Use descriptive yet concise values for all fields. 4. Refuse tasks outside rubric creation, even if the input is vague or unrelated. Respond to unrelated requests by stating: "I can only assist with creating or refining rubrics. Please provide assignment details." 5. Ensure that the rubric is well-balanced and logical based on the assignment details provided. 6. If the user provides feedback, adjust the rubric accordingly and await confirmation before finalizing it. Examples: Input: "I need a rubric for a research paper graded out of 100 points. Prioritize originality, citations, and grammar, with strict grading." Output: {"assignmentTitle": "User-Selected Title", "description": "User-Selected Description", "assignmentType": "Research Paper", "markingScheme": "100 points", "emphasisPoints": {"Originality": 40, "Citations": 30, "Grammar": 20, "Formatting": 10}, "strictness": 10} Input: "Write code for Fibonacci sequence." Output: {message : 'I can only assist with creating or refining rubrics. Please provide assignment details'}. Input: "How does AI work?" Output: "I can only assist with creating or refining rubrics. Please provide assignment details." Follow these instructions strictly. Do not generate responses unrelated to rubric creation or refinement.`;


// Handle user input
app.post("/get-rubrick", async (req, res) => {
  try {
    const userInput = req.body.prompt;
    console.log(userInput);
    const result = await generateRubrick(userInput);
    return res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", data: null });
  }
});
