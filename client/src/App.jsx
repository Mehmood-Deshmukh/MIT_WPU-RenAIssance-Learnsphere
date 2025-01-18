import React, {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import useAuthContext from "./hooks/useAuthContext";

const App = () => {
  const { state, dispatch } = useAuthContext();
  const { isAuthenticated, loading } = state;
  
	if (loading) return <h1>Loading...</h1>;


	return (
		<>
			<Routes>
				<Route
					path="/"
					element={(isAuthenticated && !loading) ? <Home /> : <Login />}
				/>

				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Singup />} />

				<Route
					path="/home"
					element={
						isAuthenticated ? <Home /> : <Navigate to="/login" />
					}
				/>
			</Routes>
		</>
	);
};

export default App;
