import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import useAuthContext from "./hooks/useAuthContext";
import StudentAssignment from "./Pages/StudentAssignment";
import StudentDashboard from "./Pages/studentDashboard";
import TeacherDashboardCourse from "./Pages/TeacherDashboardCourse";
import TeacherDashboardMain from "./Pages/TeacherDashboardMain";
import Timepass from "./components/SignupForm";
// import ViewEnrollmentRequest from "./components/ViewEnrollmentRequest";

const App = () => {
  const { state, dispatch } = useAuthContext();
  const { isAuthenticated, loading } = state;
  console.log(state);
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && !loading ? <Home /> : <Login />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />

        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/studentAssignment/:id" element={<StudentAssignment />} />
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route
          path="/teacherdashboard/:courseid"
          element={<TeacherDashboardCourse />}
        />
        <Route path="/teacher-dashboard" element={<TeacherDashboardMain />} />
        <Route path="/timepass" element={<Timepass />} />
      </Routes>
    </>
  );
};

export default App;
