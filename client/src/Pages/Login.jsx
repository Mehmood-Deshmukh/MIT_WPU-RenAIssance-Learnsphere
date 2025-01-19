import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuthContext from "../hooks/useAuthContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { dispatch } = useAuthContext();

	const handleSubmit = async (evt) => {
		console.log("login");

		evt.preventDefault();
		const formdata = new FormData();
		formdata.append("email", email);
		formdata.append("password", password);
		const data = {
			email: email,
			password: password,
		};
		try {
			const response = await axios.post(
				"http://localhost:3000/auth/login",
				data,
				{ withCredentials: true }
			);
			if (response.status === 200) {
				sessionStorage.setItem("token", response.data.token);
				localStorage.setItem("token", response.data.token);

				dispatch({ type: "LOGIN", payload: response.data });
				navigate("/home");
			}
		} catch (err) {
			console.log(err);
			toast.error("Something went wrong");
		}
	};
	return (
		<>
			<div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
				<div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
					<div
						className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
						style={{
							backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
						}}
					></div>
					<form className="w-full p-8 lg:w-1/2" onSubmit={handleSubmit}>
						<p className="text-xl text-gray-600 text-center">Welcome back!</p>
						<div className="mt-4">
							<label className="block text-gray-700 text-sm font-bold mb-2">
								Email Address
							</label>
							<input
								className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
								type="email"
								required
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
						</div>
						<div className="mt-4 flex flex-col justify-between">
							<div className="flex justify-between">
								<label className="block text-gray-700 text-sm font-bold mb-2">
									Password
								</label>
							</div>
							<input
								className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
							<a
								href="#"
								className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
							>
								Forget Password?
							</a>
						</div>
						<div className="mt-8">
							<button
								className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
								type="submit"
							>
								Login
							</button>
						</div>
						<div className="mt-4 flex items-center w-full text-center">
							<a
								href="/auth/signup"
								className="text-xs text-gray-500 capitalize text-center w-full"
							>
								Don&apos;t have any account yet?
								<span className="text-blue-700"> Sign Up</span>
							</a>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
export default Login;
