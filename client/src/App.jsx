import { Routes, Route, Navigate } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import useAuthContext from "./hooks/useAuthContext";
import StudentAssignment from "./Pages/StudentAssignment";
import StudentDashboard from "./Pages/studentDashboard";
import NotFound from "./Pages/NotFound";
import TeacherDashboardCourse from "./Pages/TeacherDashboardCourse";
import TeacherDashboardMain from "./Pages/TeacherDashboardMain";
// import ViewEnrollmentRequest from "./components/ViewEnrollmentRequest";

import AdminLogin from "./Pages/Admin/Login";
import AdminHome from "./Pages/Admin/Home";
import Spinner from "./components/Spinner";

import CoursePage from "./Pages/CoursePage";
import Sidebar from "./components/Sidebar"
const App = () => {

  const { state, dispatch } = useAuthContext();
  const { isAuthenticated, loading } = state;
  console.log(state);
  if (loading) return <Spinner />;

  return (
    <>
     {isAuthenticated && <Sidebar/> }
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && !loading ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={!isAuthenticated ? <Login /> : (state?.user?.role == 'student' ? <Navigate to="/studentDashboard" /> : <Navigate to="/teacher-dashboard" />)} />
        <Route path="/signup" element={!isAuthenticated ? <Singup /> : (state?.use?.role == 'student' ? <Navigate to="/studentDashboard" /> : <Navigate to="/teacher-dashboard" />)} />

        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/studentAssignment/:id" element={isAuthenticated ? <StudentAssignment /> : <Navigate to="/login" />} />
        <Route path="/studentDashboard" element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route
          path="/teacherdashboard/:courseid"
          element={isAuthenticated ? <TeacherDashboardCourse /> : <Navigate to="/login" />}
        />
        <Route path="/teacher-dashboard" element={isAuthenticated ? <TeacherDashboardMain /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />

        {/* admin routes */}
        <Route path="/admin/login" element={!isAuthenticated ? <AdminLogin /> : (state?.user?.role == "student" ? <Navigate to="/studentDashboard" /> : <Navigate to="/teacher-dashboard" />)} />
        <Route path="/admin/home" element={isAuthenticated ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/courses/:id" element={isAuthenticated ? <CoursePage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );

};

export default App;
