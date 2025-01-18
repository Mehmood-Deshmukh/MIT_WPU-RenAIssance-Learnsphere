import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Singup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setrollNumber] = useState("");
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("student");
  const { dispatch } = useAuthContext();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const formdata = new FormData(evt.currentTarget);
    const data = {
      email: formdata.get("email"),
      password: formdata.get("password"),
      Name: formdata.get("Name"),
      rollNumber: formdata.get("rollNumber"),
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/signup",
        data,
        { withCredentials: true }
      );
      console.log(response.status);
      sessionStorage.setItem("token", response.data.token);
      if (response.status === 200) {
        dispatch({ type: "LOGIN", payload: response.data });
        navigate("/");
      }

    } catch (err) {
      console.log(err);
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
          <form
            className="w-full p-8 lg:w-1/2"
            onSubmit={handleSubmit}
            id="myform"
          >
            <p className="text-2xl text-gray-600 text-center font-semibold">
              Sign Up
            </p>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
                name="Name"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Roll Number
              </label>
              <input
                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                type="number"
                required
                onChange={(e) => setrollNumber(e.target.value)}
                value={rollNumber}
                name="rollNumber"
              />
            </div>
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
                name="email"
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
                name="password"
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
                type="Submit"
              >
                Signup
              </button>
            </div>

            <div className="mt-4 flex items-center w-full text-center">
              <a
                href="/auth/login"
                className="text-xs text-gray-500 capitalize text-center w-full"
              >
                Already have any account ?
                <span className="text-blue-700"> Login</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Singup;
