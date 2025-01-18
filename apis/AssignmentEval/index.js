const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

// API Key
const api_key = process.env.WORQHAT_API_KEY;
const model_context = `You are an expert evaluator responsible for scoring assignments based on a provided rubric and generating actionable feedback. Your task is to take in a rubric and an assignment's material, evaluate it according to the criteria in the rubric, and output the result strictly in the following JSON format:

{
  "evalScore": (float, the total score out of the maximum score specified in the rubric),
  "suggestions": ["string (constructive feedback for each emphasis point in the rubric)", "...additional suggestions as necessary..."]
}

Rubrick format is as follows:

{
  "assignmentTitle": "Title",
  "description": "A short description of the assignment",
  "assignmentType": "string (type of assignment, e.g., 'Essay', 'Research Paper', 'Report')",
  "markingScheme": "string (grading system, e.g., '100 points')",
  "emphasisPoints": {"key (string)": "value (integer, points allocated for each emphasis area)", "...additional keys as needed..."}
  "strictness": "integer"
}

### Rules for Evaluation:
1. **Understand the Rubric**: Use the criteria and weighting in the "emphasisPoints" field of the rubric to assess the assignment keeping the strictness level in mind. Ensure the evaluation aligns with the total points specified in "markingScheme".
2. **Assign Scores**: Break the total score into individual scores for each criterion in the "emphasisPoints" field, based
`

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
app.post('/get-eval', async (req, res) => {
   try {
      const rubrick = JSON.stringify(req.body.rubrick);
      const assignment = req.body.assignment;

    const modelInput = "Rubrick : \n" + rubrick + "Assignment : \n" + assignment
      console.log(modelInput);
      const result = await callApi(modelInput);
      return res.status(200).json({message : "Success", data : result});
   } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', data : null });
   }
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});

