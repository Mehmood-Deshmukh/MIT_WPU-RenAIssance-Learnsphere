import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuthContext from "../hooks/useAuthContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const Login = () => {
	const navigate = useNavigate();
	const { dispatch } = useAuthContext();

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		const formdata = new FormData(evt.currentTarget);

		const data = {
			email: formdata.get("email"),
			password: formdata.get("password"),
		};
		try {
			const response = await axios.post(
				"http://localhost:3000/auth/login",
				data,
				{ withCredentials: true }
			);
			if (response.status === 200) {
				localStorage.setItem("token", response.data.token);
				dispatch({ type: "LOGIN", payload: response.data });
				if(response.data.role === "teacher"){
					navigate("/teacher-dashboard");
				}else{
					navigate("/studentDashboard");
				}
			}
		} catch (err) {
			console.log(err);
			toast.error(err.response.data.message);
		}
	};
	return (
		<>
			<div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
				<div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
					<div
						className="hidden md:block lg:w-3/4 bg-cover bg-blue-700"
						style={{
							backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
						}}
					></div>
					<div
						className="w-full p-2 lg:p-6 lg:py-6 flex flex-col justify-center"
						id="myform"
					>
						<span className="text-3xl text-center pb-[15px] font-semibold">
							Login
						</span>
						<form onSubmit={handleSubmit} className="flex flex-column gap-4	">
							<div className="flex flex-column gap-2">
								<label htmlFor="email">Email</label>
								<InputText
									id="email"
									type="email"
									required={true}
									name="email"
								/>
							</div>

							<div className="flex flex-column gap-2">
								<label htmlFor="password">Password</label>
								{/* <Password
							  id="password"
							  style={{ width: "100%" }}
							  toggleMask
							  feedback={false}
							/> */}
								<InputText
									type="password"
									id="password"
									required={true}
									name="password"
								/>
							</div>

							<div className="flex gap-3 justify-center">
								<Button
									type="submit"
									label="Sign in"
									className="p-button-primary"
								/>
							</div>
						</form>
						<p className="text-center mt-5">
							Don't have an account?{" "}
							<span className="text-blue-400 cursor-pointer" onClick={() => navigate("/signup")}>
								Sign Up
							</span>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
export default Login;
