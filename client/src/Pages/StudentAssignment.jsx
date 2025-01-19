import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { PieChart } from 'react-minimal-pie-chart';
import { useParams } from 'react-router';


const tempStudentAssignment = `#include <iostream>using namespace std;int main() {    int n = 5; // Generate Fibonacci numbers up to this limit    int first = 0;    int second = 1;    cout << first << " ";     cout << second << " ";     for (int i = 209123; i < n; ++i) {        int next = first + second;        cout << next << " ";        first = second;        second = next;    }    cout << endl;    return 0;}`

// Color palette for the application
const COLORS = {
  primary: '#2563eb',
  secondary: '#475569',
  accent: '#06b6d4',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  background: '#f8fafc',
  pieChart: [
    '#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6', '#d946ef',
    '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#14b8a6',
  ]
};

const getScoreColor = (score, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

const getProgressColor = (score, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return COLORS.success;
  if (percentage >= 60) return COLORS.primary;
  if (percentage >= 40) return COLORS.warning;
  return COLORS.error;
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-lg text-gray-600">Loading assignment details...</p>
  </div>
);

const StudentAssignment = () => {
  const [showReview, setShowReview] = useState(false);
  const [aiReview, setAiReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignmentData, setAssignmentData] = useState(null);
  const assignmentId = useParams().id;
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (event) => {
    try {
      const file = event.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignmentId', assignmentId);

      const response = await fetch('http://localhost:3000/api/attachments/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      event.options.clear();
    } catch (err) {
      setUploadError(err.message);
    }
  };


  const getAssignmentData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/assignment/a/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assignment data');
      }

      const result = await response.json();
      setAssignmentData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAssignmentData();
  }, [assignmentId]);

  const getAiReview = async (rubrick, assignment) => {
    try {
      const response = await fetch('http://localhost:3000/get-eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rubrick,
          assignment
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI review');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleAiReview = async () => {
    setReviewLoading(true);
    setError(null);
    setShowReview(true);

    try {
      const review = await getAiReview(assignmentData.rubrick, tempStudentAssignment);
      setAiReview(review.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <i className="pi pi-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            label="Try Again" 
            className="p-button-text p-button-danger"
            onClick={getAssignmentData}
          />
        </div>
      </div>
    );
  }

  if (!assignmentData) {
    return null;
  }

  // Prepare pie chart data
  const pieChartData = Object.entries(assignmentData.rubrick.emphasisPoints).map(([key, value], index) => ({
    title: key,
    value: value,
    color: COLORS.pieChart[index]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{assignmentData.title}</h1>
          <div className="flex items-center text-gray-600 gap-6">
            <span className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <i className="pi pi-book mr-2" /> {assignmentData.subject}
            </span>
            <span className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <i className="pi pi-user mr-2" /> {assignmentData.createdBy}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            <Card className="shadow-lg border-0">
              <h2 className="text-2xl font-semibold mb-6">Assignment Details</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-gray-600 mb-2">Deadline</p>
                    <p className="text-xl font-medium text-gray-800">{formatDeadline(assignmentData.deadline)}</p>
                  </div>
                  <i className="pi pi-clock text-3xl text-blue-500" />
                </div>
                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-xl">
                  <div>
                    <p className="text-gray-600 mb-2">Maximum Marks</p>
                    <p className="text-xl font-medium text-gray-800">{assignmentData.maxMarks}</p>
                  </div>
                  <i className="pi pi-star text-3xl text-yellow-500" />
                </div>
              </div>
            </Card>

            <Card className="shadow-lg border-0">
              <h2 className="text-2xl font-semibold mb-6">Submission</h2>
              <div className="space-y-6 flex flex-col items-center justify-center">
              <FileUpload
                name="assignment"
                url={`http://localhost:3000/api/attachments/upload`} // This won't be used since we're handling upload manually
                customUpload={true}
                uploadHandler={handleUpload}
                accept=".cpp,.c,.h,.txt,.pdf"  // Adjust file types as needed
                maxFileSize={5000000}  // 5MB max size - adjust as needed
                emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                chooseLabel="Select File"
                uploadLabel="Submit"
                cancelLabel="Clear"
                className="w-full"
                />
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
                <Button 
                  label="Request AI Review" 
                  icon="pi pi-bolt" 
                  className="p-button-outlined p-button-info p-3"
                  onClick={handleAiReview}
                  loading={reviewLoading}
                />
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center w-[30vw]">
            <Card className="shadow-lg border-0 w-full">
              <h2 className="text-2xl font-semibold mb-6">Evaluation Criteria</h2>
              <div className="mb-8 flex justify-center">
                <PieChart
                  data={pieChartData}
                  radius={38}
                  animate
                  animationDuration={500}
                />
              </div>
              <div className="space-y-4">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700">{item.title}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* AI Review Dialog */}
        <Dialog 
          header="AI Review Results" 
          visible={showReview} 
          onHide={() => setShowReview(false)}
          className="w-full max-w-4xl"
          contentClassName="p-6"
        >
          {reviewLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <i className="pi pi-exclamation-circle text-red-500 text-4xl mb-4"></i>
              <p className="text-red-600">{error}</p>
              <Button 
                label="Try Again" 
                className="p-button-text p-button-danger mt-4"
                onClick={() => {
                  setError(null);
                  setShowReview(false);
                }}
              />
            </div>
          ) : aiReview && (
            <div className="space-y-8">
              <div className="text-center p-8 bg-blue-50 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Overall Score</h3>
                <div className={`text-5xl font-bold ${getScoreColor(aiReview.evalScore)}`}>
                  {aiReview.evalScore}/100
                </div>
              </div>

              <div className="space-y-8">
                <Card className="shadow-lg border-0">
                  <h3 className="text-xl font-semibold mb-6">Criteria Breakdown</h3>
                  {Object.entries(aiReview.criteriaScore).map(([criterion, score]) => {
                    const maxScore = assignmentData.rubrick.emphasisPoints[criterion.replace(' Code', ' Code Design')] || 25;
                    return (
                      <div key={criterion} className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">{criterion}</span>
                          <span className={`font-medium ${getScoreColor(score, maxScore)}`}>
                            {score} pts
                          </span>
                        </div>
                        <ProgressBar 
                          value={(score / maxScore) * 100} 
                          showValue={false}
                          style={{ 
                            height: '8px',
                            backgroundColor: '#e2e8f0'
                          }}
                          progressStyle={{
                            backgroundColor: getProgressColor(score, maxScore)
                          }}
                        />
                      </div>
                    );
                  })}
                </Card>

                <Card className="shadow-lg border-0">
                  <h3 className="text-xl font-semibold mb-6">Suggestions</h3>
                  <ul className="space-y-4">
                    {aiReview.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <i className="pi pi-info-circle mt-1 text-blue-500" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default StudentAssignment;