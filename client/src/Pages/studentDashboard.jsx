import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const user = state.user;

  const enrolledCourses = [
    { id: 1, name: 'Advanced Web Development', progress: 65, nextLesson: 'React Hooks Deep Dive', instructor: 'Dr. Sarah Wilson' },
    { id: 2, name: 'Data Structures & Algorithms', progress: 40, nextLesson: 'Binary Trees', instructor: 'Prof. Michael Chen' },
    { id: 3, name: 'Machine Learning Basics', progress: 25, nextLesson: 'Neural Networks', instructor: 'Dr. James Miller' }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'React Project', course: 'Advanced Web Development', dueDate: '2025-01-25', status: 'pending' },
    { id: 2, title: 'Algorithm Analysis', course: 'Data Structures & Algorithms', dueDate: '2025-01-22', status: 'pending' },
    { id: 3, title: 'Dataset Analysis', course: 'Machine Learning Basics', dueDate: '2025-01-28', status: 'pending' }
  ];

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
              <p className="text-4xl font-bold text-green-900 m-0">{enrolledCourses.length}</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 bg-blue-50">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-check-circle text-blue-500" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <p className="text-blue-700 text-xl m-0">Completed</p>
              <p className="text-4xl font-bold text-blue-900 m-0">12</p>
            </div>
          </div>
        </Card>

        <Card className="flex-1 bg-yellow-50">
          <div className="flex align-items-center gap-3">
            <i className="pi pi-exclamation-circle text-yellow-500" style={{ fontSize: '2.5rem' }}></i>
            <div>
              <p className="text-yellow-700 text-xl m-0">Pending</p>
              <p className="text-4xl font-bold text-yellow-900 m-0">{upcomingAssignments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Assignments */}
      <div className="flex flex-column lg:flex-row gap-4">
        <div className="flex-1">
          <Panel header={
            <div className="flex align-items-center">
              <i className="pi pi-exclamation-triangle text-yellow-500 mr-2" style={{ fontSize: '1.5rem' }}></i>
              <h2 className="m-0 text-xl">Pending Assignments</h2>
            </div>
          } className="h-full">
            <div className="flex flex-column gap-3">
              {upcomingAssignments.map(assignment => (
                <Card key={assignment.id} className="border-left-3 border-yellow-500">
                  <div className="flex justify-content-between align-items-start">
                    <div>
                      <h3 className="text-xl font-semibold m-0 mb-2">{assignment.title}</h3>
                      <p className="text-600 m-0">{assignment.course}</p>
                    </div>
                    <Tag severity="warning" value={
                      new Date(assignment.dueDate).toLocaleDateString()
                    } />
                  </div>
                </Card>
              ))}
            </div>
          </Panel>
        </div>

        {/* Enrolled Courses */}
        <div className="flex-1">
          <Panel header={
            <div className="flex align-items-center">
              <i className="pi pi-book text-blue-500 mr-2" style={{ fontSize: '1.5rem' }}></i>
              <h2 className="m-0 text-xl">Course Progress</h2>
            </div>
          } className="h-full">
            <div className="flex flex-column gap-3">
              {enrolledCourses.map(course => (
                <Card key={course.id} className="border-left-3 border-blue-500">
                  <div className="mb-3">
                    <div className="flex justify-content-between align-items-center mb-2">
                      <h3 className="text-xl font-semibold m-0">{course.name}</h3>
                      <Tag value={`${course.progress}%`} severity="info" />
                    </div>
                    <p className="text-600 m-0 mb-2">Instructor: {course.instructor}</p>
                    <p className="text-600 m-0 mb-3">Next: {course.nextLesson}</p>
                    <ProgressBar 
                      value={course.progress} 
                      showValue={false} 
                      style={{ height: '8px' }}
                      className="bg-blue-100"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;