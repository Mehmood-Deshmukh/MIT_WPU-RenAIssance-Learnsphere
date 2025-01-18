import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';

// Temporary data
const assignmentData = {
  title: "C Program: Fibonacci Sequence (Recursive)",
  subject: "Computer Science",
  deadline: new Date("2024-02-01"),
  maxMarks: 100,
  createdBy: "Prof. John Doe",
  rubrick: {
    assignmentType: "Coding Assignment",
    emphasisPoints: {
      "Correctness": 40,
      "Modular Code Design": 30,
      "Comments and Readability": 20,
      "Recursive Implementation": 10
    },
    strictness: 8
  }
};

const AssignmentDetails = () => {
  const [showReview, setShowReview] = useState(false);
  const [aiReview, setAiReview] = useState(null);

  // Temporary AI review data
  const tempAiReview = {
    evalScore: 50,
    criteriaScore: {
      "Correctness": 10,
      "Modular Code": 20,
      "Commenting": 10,
      "Iterative Solution": 10
    },
    suggestions: [
      "The program's logic for generating Fibonacci numbers is flawed.",
      "The code lacks modularity.",
      "The code has minimal commenting.",
      "The program uses an iterative approach."
    ],
    areasOfImprovement: [
      "Algorithm Correctness",
      "Code Structure and Modularity",
      "Code Documentation and Comments"
    ]
  };

  const handleAiReview = () => {
    setAiReview(tempAiReview);
    setShowReview(true);
  };

  const formatDeadline = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{assignmentData.title}</h1>
        <div className="flex items-center text-gray-600 gap-4">
          <span className="flex items-center">
            <i className="pi pi-book mr-2" /> {assignmentData.subject}
          </span>
          <span className="flex items-center">
            <i className="pi pi-user mr-2" /> {assignmentData.createdBy}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Assignment Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-medium">{formatDeadline(assignmentData.deadline)}</p>
                </div>
                <i className="pi pi-clock text-2xl text-blue-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Maximum Marks</p>
                  <p className="font-medium">{assignmentData.maxMarks}</p>
                </div>
                <i className="pi pi-star text-2xl text-yellow-500" />
              </div>
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Submission</h2>
            <FileUpload 
              mode="basic" 
              name="assignment" 
              url="/api/upload" 
              accept=".pdf,.doc,.docx,.txt"
              maxFileSize={10000000}
              className="mb-4"
            />
            <Button 
              label="Request AI Review" 
              icon="pi pi-bolt" 
              className="p-button-outlined p-button-info"
              onClick={handleAiReview}
            />
          </Card>
        </div>

        {/* Right Column */}
        <div>
        <PieChart
            data={[
                { title: 'One', value: 10, color: '#E38627' },
                { title: 'Two', value: 15, color: '#C13C37' },
                { title: 'Three', value: 20, color: '#6A2135' },
            ]}
            />;
        </div>
      </div>

      {/* AI Review Dialog */}
      <Dialog 
        header="AI Review Results" 
        visible={showReview} 
        onHide={() => setShowReview(false)}
        style={{ width: '80vw' }}
      >
        {aiReview && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Overall Score</h3>
              <div className="text-4xl font-bold text-blue-600">{aiReview.evalScore}/100</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-xl font-semibold mb-4">Criteria Breakdown</h3>
                {Object.entries(aiReview.criteriaScore).map(([criterion, score]) => (
                  <div key={criterion} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span>{criterion}</span>
                      <span className="font-medium">{score} pts</span>
                    </div>
                    <ProgressBar value={score * 10} showValue={false} />
                  </div>
                ))}
              </Card>

              <Card>
                <h3 className="text-xl font-semibold mb-4">Suggestions</h3>
                <ul className="list-disc pl-4 space-y-2">
                  {aiReview.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AssignmentDetails;