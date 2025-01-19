import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

const EmptyState = ({ icon, title, message, action }) => (
  <div className="flex flex-column align-items-center justify-content-center py-8 px-4">
    <i className={`${icon} text-blue-300 mb-4`} style={{ fontSize: '3rem' }}></i>
    <h3 className="text-xl font-semibold text-900 mb-2">{title}</h3>
    <p className="text-600 text-center mb-4">{message}</p>
    {action && (
      <Button
        label={action.label} 
        icon={action.icon} 
        className="p-button-rounded p-button-outlined"
        onClick={action.onClick}
      />
    )}
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const {state, dispatch} = useAuthContext();
  const user = state.user;

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/courses/getAllCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      setEnrolledCourses(data.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchPendingAssignments = async () => {
    try {
      // Fetch pending assignments
      const response = await fetch('/api/assignment/getPendingAssignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      setUpcomingAssignments(data.data);
    } catch (error) {
      console.error('Error fetching pending assignments:', error);
    }
  }

  useEffect(() => {
    fetchEnrolledCourses();
    fetchPendingAssignments();
  }, []);

  return (
    <div className="p-4">
      {/* User Profile Card */}
      <Card className="mb-4 bg-blue-50">
        <div className="flex flex-column md:flex-row align-items-center md:align-items-start gap-4">
          <Avatar 
            icon="pi pi-user" 
            size="xlarge" 
            style={{ backgroundColor: '#2196F3', color: '#ffffff', width: '100px', height: '100px' }}
            className="p-overlay-badge"
          />
          <div className="flex-1">
            <div className="flex flex-column md:flex-row justify-content-between align-items-center">
              <div>
                <h1 className="text-4xl font-bold m-0 mb-2">{user?.Name || 'Student'}</h1>
                <div className="flex align-items-center gap-3 mb-2">
                  <Tag severity="info" value={`Roll: ${user?.rollNumber}`} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-600 m-0"><i className="pi pi-envelope mr-2"></i>{user?.email}</p>

              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="flex flex-column md:flex-row gap-4 mb-4">
        <Card className="flex-1 bg-green-50">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-book text-green-500" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <p className="text-green-700 text-xl m-0">Enrolled Courses</p>
              <p className="text-4xl font-bold text-green-900 m-0">{enrolledCourses?.length}</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 bg-blue-50">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-check-circle text-blue-500" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <p className="text-blue-700 text-xl m-0">Completed</p>
              <p className="text-4xl font-bold text-blue-900 m-0">{user?.assignments?.length}</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 bg-yellow-50">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-exclamation-circle text-yellow-500" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <p className="text-yellow-700 text-xl m-0">Pending</p>
              <p className="text-4xl font-bold text-yellow-900 m-0">{upcomingAssignments?.length}</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="flex gap-4">
        {/* Pending Assignments */}
        <Panel header="Pending Assignments" className="shadow-md border-round-xl flex-1">
          {upcomingAssignments.length ? (
            upcomingAssignments.map((assignment) => (
              <Card key={assignment.id} className="flex flex-column gap-2 p-3 mb-3">
                <h3>{assignment.title}</h3>
                <p>{assignment.course}</p>
                <Tag value={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`} severity="warning" />
              </Card>
            ))
          ) : (
            <EmptyState
              icon="pi pi-check-circle"
              title="All Caught Up!"
              message="You have no pending assignments."
            />
          )}
        </Panel>

        {/* Course Progress */}
        <Panel header="Course Progress" className="shadow-md border-round-xl flex-1">
          {enrolledCourses.length ? (
            enrolledCourses.map((course) => (
              <Card key={course.id} className="flex flex-column gap-2 p-3 mb-3">
                <h3>{course.name}</h3>
                <p>{course.instructor}</p>
                <ProgressBar value={course.progress} />
              </Card>
            ))
          ) : (
            <EmptyState
              icon="pi pi-book"
              title="No Courses Yet"
              message="You haven't enrolled in any courses."
            />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default StudentDashboard;