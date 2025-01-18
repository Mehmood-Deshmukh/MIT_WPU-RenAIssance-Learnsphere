import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "primereact/button";

const Mysignup = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex align-items-center justify-content-center">
      <div className="flex align-items-center justify-content-center w-[50vw]">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">
              Welcome Back
            </div>
            <span className="text-600 font-medium line-height-3">
              Don&apos;t have an account?
            </span>
            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
              SignUp
            </a>
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full mb-3"
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
            />

            <Button label="Sign In" icon="pi pi-user" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mysignup;
