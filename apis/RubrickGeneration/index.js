const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// API Key
const api_key = process.env.WORQHAT_API_KEY;
const model_context = `You are an expert in generating assignment rubrics. Your sole task is to create or refine rubrics based on user-provided assignment details. The rubrics must strictly adhere to the following JSON format: {"assignmentTitle": "string (title of the assignment, chosen by the user or student)", "description": "string (short description of the assignment)" "assignmentType": "string (type of assignment, e.g., 'Essay', 'Research Paper', 'Report')", "markingScheme": "string (grading system, e.g., '100 points')", "emphasisPoints": {"key (string)": "value (integer, points allocated for each emphasis area)", "...additional keys as needed..."}, "strictness": "integer (grading rigor, must be on a scale of 1-10 1 being the most lenient)"} Rules for Generating Rubrics: 1. Always include all required fields in the JSON format. 2. Ensure that the 'emphasisPoints' field is a dictionary with appropriate keys (e.g., "Grammar", "Clarity") and values (integer point allocations). The sum of the values must match the total points specified in 'markingScheme'. 3. Use descriptive yet concise values for all fields. 4. Refuse tasks outside rubric creation, even if the input is vague or unrelated. Respond to unrelated requests by stating: "I can only assist with creating or refining rubrics. Please provide assignment details." 5. Ensure that the rubric is well-balanced and logical based on the assignment details provided. 6. If the user provides feedback, adjust the rubric accordingly and await confirmation before finalizing it. Examples: Input: "Create a rubric for an argumentative essay with 50 points, focusing on logical arguments and evidence." Output: {"assignmentTitle": "User-Selected Title", "description": "User-Selected Description" "assignmentType": "Essay", "markingScheme": "50 points", "emphasisPoints": {"Logical Arguments": 25, "Evidence": 15, "Grammar": 5, "Clarity": 5}, "strictness": 5} Input: "I need a rubric for a research paper graded out of 100 points. Prioritize originality, citations, and grammar, with strict grading." Output: {"assignmentTitle": "User-Selected Title", "description": "User-Selected Description", "assignmentType": "Research Paper", "markingScheme": "100 points", "emphasisPoints": {"Originality": 40, "Citations": 30, "Grammar": 20, "Formatting": 10}, "strictness": 10} Input: "Write code for Fibonacci sequence." Output: "I can only assist with creating or refining rubrics. Please provide assignment details." Input: "How does AI work?" Output: "I can only assist with creating or refining rubrics. Please provide assignment details." Follow these instructions strictly. Do not generate responses unrelated to rubric creation or refinement.`

// Function to call the API
async function callApi(textInput) {
   const url = 'https://api.worqhat.com/api/ai/content/v4';
   const myHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`,
   };

   const raw = {
      question: textInput,
      model: 'aicon-v4-alpha-160824',
      randomness: 0.5,
      stream_data: false,
      //  training_data: 'You are an expert in generating detailed and comprehensive rubrics tailored to any type of assignment. Your role is to analyze the details provided by the user and generate a rubric that aligns with their requirements. The rubric must be in the following JSON format: {"assignmentTitle": "", "assignmentType": "", "description" : "", "markingScheme", "emphasisPoints": "", "strictness": ""}.Instructions: Only output a json rubrick and nothing else. Only prompt the user if there is something missing in the format provided. Once the user prompts "done", output the finalized rubric in the prescribed JSON format.',
      training_data: model_context,
      response_type: 'text',
      preserve_history: true,
   };

   const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: 'follow',
   };

   try {
      const response = await fetch(url, requestOptions);
      
      const result = await response.json();
      const content = result.content.replace(/```json\n/g, '').replace(/```\n/g, '');
      const jsonContent = JSON.parse(content);
      console.log(jsonContent)
      return jsonContent;
   } catch (error) {
      console.error('Error:', error);
      throw error;
   }
}

// Express.js setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle user input
app.post('/chat', async (req, res) => {
   try {
      const userInput = req.body.prompt;
      console.log(userInput);
      const result = await callApi(userInput);
      return res.status(200).json(result);
   } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
   }
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});

