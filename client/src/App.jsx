import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import TeacherDashboardCourse from "./Pages/TeacherDashboardCourse";
import TeacherDashboardMain from "./Pages/TeacherDashboardMain";
// import ViewEnrollmentRequest from "./components/ViewEnrollmentRequest";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Singup />} />
        <Route
          path="/teacherdashboard/:courseid"
          element={<TeacherDashboardCourse />}
        />
        <Route path="/teacher-dashboard" element={<TeacherDashboardMain />} />
      </Routes>
    </>
  );
};

export default App;
