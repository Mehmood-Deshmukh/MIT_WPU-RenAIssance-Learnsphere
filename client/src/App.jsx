import React, { useEffect } from "react";
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

import CoursePage from "./Pages/CoursePage";

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
				<Route path="*" element={<NotFound />} />

				{/* admin routes */}
				<Route path="/admin/login" element={<AdminLogin />} />
				<Route path="/admin/home" element={<AdminHome />} />
				<Route path="/courses/:id" element={<CoursePage />} />
			</Routes>
		</>
	);
};

export default App;
