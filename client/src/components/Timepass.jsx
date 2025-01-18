import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";

const Timepass = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    misNumber: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRoleSelect = (e) => {
    setRole(e.value);
  };

  const nextStep = () => {
    if (role) {
      setCurrentStep(2);
      setSubmitted(false);
    } else {
      setSubmitted(true);
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.misNumber
    ) {
      // Here you would typically make an API call to submit the form
      console.log("Form submitted:", { ...formData, role });
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
    <form onSubmit={handleSubmit} className="flex flex-column gap-4">
      <h2>Sign Up as {role}</h2>

      <div className="flex flex-column gap-2">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange(e, "name")}
          className={classNames({ "p-invalid": submitted && !formData.name })}
        />
        {submitted && !formData.name && (
          <small className="p-error">Name is required</small>
        )}
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="email">Email</label>
        <InputText
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e, "email")}
          className={classNames({ "p-invalid": submitted && !formData.email })}
        />
        {submitted && !formData.email && (
          <small className="p-error">Email is required</small>
        )}
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="password">Password</label>
        <Password
          id="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e, "password")}
          className={classNames({
            "p-invalid": submitted && !formData.password,
          })}
          toggleMask
          feedback={true}
        />
        {submitted && !formData.password && (
          <small className="p-error">Password is required</small>
        )}
      </div>

      <div className="flex flex-column gap-2">
        <label htmlFor="misNumber">MIS Number</label>
        <InputText
          id="misNumber"
          value={formData.misNumber}
          onChange={(e) => handleInputChange(e, "misNumber")}
          className={classNames({
            "p-invalid": submitted && !formData.misNumber,
          })}
        />
        {submitted && !formData.misNumber && (
          <small className="p-error">MIS Number is required</small>
        )}
      </div>

      <div className="flex gap-3">
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
      <Card className="w-full md:w-6 lg:w-4">
        {currentStep === 1 ? <RoleSelection /> : <SignupDetails />}
      </Card>
    </div>
  );
};

export default Timepass;
