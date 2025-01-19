import { useState } from "react";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { dispatch } = useAuthContext();

  const handleRoleSelect = (e) => {
    setRole(e.value);
  };

  const handleStudentSubmit = async (evt) => {
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

  const handleTeacherSubmit = async (evt) => {
    console.log("Teacher Submit");
    const formdata = new FormData(evt.currentTarget);
    const data = {
      email: formdata.get("email"),
      password: formdata.get("password"),
      Name: formdata.get("Name"),
      rollNumber: formdata.get("rollNumber"),
      role: "teacher",
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
        console.log(response.data.data);
        Swal.fire({
          title: "Your Request has been sent to Admin",
          icon: "success",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const nextStep = () => {
    if (role) {
      setCurrentStep(2);
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  };

  const RoleSelection = () => (
    <div className="flex flex-column align-items-center gap-4">
      <h2>Choose your role</h2>
      <div className="flex flex-column gap-3">
        <div className="flex align-items-center gap-2">
          <RadioButton
            inputId="teacher"
            name="role"
            value="teacher"
            onChange={handleRoleSelect}
            checked={role === "teacher"}
          />
          <label htmlFor="teacher">Teacher</label>
        </div>
        <div className="flex align-items-center gap-2">
          <RadioButton
            inputId="student"
            name="role"
            value="student"
            onChange={handleRoleSelect}
            checked={role === "student"}
          />
          <label htmlFor="student">Student</label>
        </div>
      </div>
      {submitted && !role && (
        <small className="p-error">Please select a role</small>
      )}
      <Button label="Next" onClick={nextStep} className="w-full" />
    </div>
  );

  const SignupDetails = () => (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        role === "student"
          ? handleStudentSubmit(evt)
          : handleTeacherSubmit(evt);
        setSubmitted(true);
      }}
      className="flex flex-column gap-4"
    >
      <h2>Sign Up as {role}</h2>
      <div className="flex flex-column gap-2">
        <label htmlFor="name">Name</label>
        <InputText id="name" required={true} name="Name" />
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="email">Email</label>
        <InputText id="email" type="email" required={true} name="email" />
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

      <div className="flex flex-column gap-2">
        <label htmlFor="misNumber">MIS Number</label>
        <InputText id="misNumber" required={true} name="rollNumber" />
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          type="button"
          label="Back"
          onClick={() => setCurrentStep(1)}
          className="p-button-secondary"
        />
        <Button type="submit" label="Sign Up" className="p-button-primary" />
      </div>
    </form>
  );

  return (
    <div className="flex justify-content-center">
      <div className="w-full">
        {currentStep === 1 ? <RoleSelection /> : <SignupDetails />}
      </div>
    </div>
  );
};

export default SignupForm;
