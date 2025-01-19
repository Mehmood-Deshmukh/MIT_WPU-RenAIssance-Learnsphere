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
import { DataView } from 'primereact/dataview';

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
  const [allCourses, setAllCourses] = useState([]);
  const courseTemplate = (course) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-2">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex justify-content-between align-items-center">
              <h3 className="text-xl font-bold m-0">{course.name}</h3>
              {/* <Tag
                severity={getStatusSeverity(course.status)}
                value={course.status?.toUpperCase()}
              /> */}
            </div>
            <div className="my-3">
              <p className="m-0">
                <strong>Course Title: {course.title}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Description: {course.description.substring(0, 20)}....
                </strong>
              </p>
              <p className="m-0">
                <strong>No of Students: {course.students.length}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Course Status :{" "}
                  {course.isApproved ? (
                    <span className="text-green-700">Ongoing</span>
                  ) : (
                    <span className="text-orange-500">Pending Approval</span>
                  )}
                </strong>
              </p>
            </div>
  
            <div className="mt-auto pt-3">
              {course.isApproved ? (
                <Button
                  label="View Details"
                  className="p-button-outlined w-full"
                  onClick={() => navigate(`/courses/${course._id}`)}
                />
              ) : (
                <div className="text-orange-500 border-2 p-2 text-center font-semibold rounded-md border-orange-500">
                  Waiting for Approval
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const assignmentTemplate = (assignment) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-2">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex justify-content-between align-items-center">
              <h3 className="text-xl font-bold m-0">{assignment.title}</h3>
            </div>
            
            <div className="my-3">
              <p className="m-0">
                <strong>Course: {assignment.course}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Description: {assignment.description?.substring(0, 20)}....
                </strong>
              </p>
              <p className="m-0">
                <strong>Due Date: {new Date(assignment.deadline).toLocaleDateString()}</strong>
              </p>
              <p className="m-0">
                <strong>
                  Status:{" "}
                  <span className="text-orange-500">Pending</span>
                </strong>
              </p>
            </div>
  
            <div className="mt-auto pt-3">
              <Button
                label="View Assignment"
                className="p-button-outlined w-full"
                onClick={() => navigate(`/studentAssignment/${assignment._id}`)}
               />
            </div>
          </div>
        </Card>
      </div>
    );
  };


  const fetchAllCourses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/course/getAllCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      setAllCourses(data.data);
    } catch (error) {
      console.error('Error fetching all courses:', error);
    }
  };




  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/course/getAllUserCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      console.log(data);
      setEnrolledCourses(data.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchPendingAssignments = async () => {
    try {
      // Fetch pending assignments
      const response = await fetch('http://localhost:3000/api/assignment/getPendingAssignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        }
      });
      const data = await response.json();
      console.log("pending assignments", data.data);
      setUpcomingAssignments(data.data);
    } catch (error) {
      console.error('Error fetching pending assignments:', error);
    }
  }

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAllCourses();
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
        {/* Pending Assignments */}
        <Panel header="Pending Assignments" className="shadow-md border-round-xl flex-1">
      {upcomingAssignments?.length ? (
        <DataView 
          value={upcomingAssignments} 
          itemTemplate={assignmentTemplate} 
          layout="grid" 
        />
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
            <DataView value={enrolledCourses} itemTemplate={courseTemplate} layout="grid" />
          ) : (
            <EmptyState
              icon="pi pi-book"
              title="No Courses Yet"
              message="You haven't enrolled in any courses."
            />
          )}
        </Panel>

      <Panel header="All Courses" className="shadow-md border-round-xl flex-1 mt-5">
          {allCourses.length ? (
            <DataView value={allCourses} itemTemplate={courseTemplate} layout="grid" />
          ) : (
            <EmptyState
              icon="pi pi-book"
              title="No Courses"
              message="There aren't any courses."
            />
          )}
        </Panel>
      
    </div>
  );
};

export default StudentDashboard;