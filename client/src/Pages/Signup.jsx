import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
// import { useState } from "react";
import Timepass from "../components/Timepass";

const Singup = () => {
  const navigate = useNavigate();
  console.log("this");

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
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full min-h-[70vh]">
          <div
            className="hidden md:block lg:w-full bg-cover bg-blue-700"
            style={{
              backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
            }}
          ></div>
          <div
            className="w-full p-2 lg:p-6 lg:py-6 flex flex-col justify-center"
            onSubmit={handleSubmit}
            id="myform"
          >
            <span className="text-3xl text-center pb-[15px] font-semibold">
              Sign Up
            </span>
            <Timepass />
          </div>
        </div>
      </div>
    </>
  );
};
export default Singup;
