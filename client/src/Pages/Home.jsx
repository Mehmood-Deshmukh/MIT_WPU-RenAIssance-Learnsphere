import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Temporary data
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

/*   // useEffect(() => {
  //   const authUser = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       navigate("/login");
  //     }
  //     try {
  //       const getToken = JSON.parse(localStorage.getItem("token"));
  //       const token = `Bearer ${getToken}`;
  //       const response = await axios.post(
  //         "http://localhost:3000/auth/authenticate-user",
  //         {},
  //         { headers: { Authorization: token } }
  //       );
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err);
  //       navigate("/login");
  //     }
  //   };
  //   authUser();
  // }, [navigate]); */

/*   // if (loading) {
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
  //       <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
  //     </div>
  //   );
  // } */

  return (
    <div className="grid p-4">
      {/* Welcome Section */}
      <div className="col-12 mb-4">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="text-gray-600">Here's what's happening with your courses</p>
      </div>

      {/* Stats Overview */}
      <div className="col-12 grid">
        <div className="col-12 md:col-4">
          <Card>
            <div className="flex align-items-center">
              <i className="pi pi-book text-primary mr-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <p className="text-gray-600">Enrolled Courses</p>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card>
            <div className="flex align-items-center">
              <i className="pi pi-check-circle text-green-500 mr-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <p className="text-gray-600">Completed Assignments</p>
                <p className="text-3xl font-bold">12</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card>
            <div className="flex align-items-center">
              <i className="pi pi-exclamation-circle text-red-500 mr-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <p className="text-gray-600">Pending Assignments</p>
                <p className="text-3xl font-bold">{upcomingAssignments.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="col-12 md:col-6 mt-4">
        <Panel header={<div className="flex align-items-center"><i className="pi pi-book mr-2"></i>Enrolled Courses</div>}>
          {enrolledCourses.map(course => (
            <div key={course.id} className="mb-4">
              <div className="flex justify-content-between align-items-center mb-2">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                  <p className="text-gray-600">Instructor: {course.instructor}</p>
                  <p className="text-gray-600">Next: {course.nextLesson}</p>
                </div>
                <Tag value={`${course.progress}% Complete`} severity="info" />
              </div>
              <ProgressBar value={course.progress} showValue={false} style={{ height: '8px' }} />
              <Divider />
            </div>
          ))}
        </Panel>
      </div>

      {/* Upcoming Assignments */}
      <div className="col-12 md:col-6 mt-4">
        <Panel header={<div className="flex align-items-center"><i className="pi pi-calendar mr-2"></i>Upcoming Assignments</div>}>
          {upcomingAssignments.map(assignment => (
            <div key={assignment.id} className="mb-4">
              <div className="flex justify-content-between align-items-center">
                <div>
                  <h3 className="text-lg font-semibold">{assignment.title}</h3>
                  <p className="text-gray-600">{assignment.course}</p>
                </div>
                <div className="flex align-items-center">
                  <i className="pi pi-clock mr-2"></i>
                  <span className="text-gray-600">
                    Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
};

export default Dashboard;