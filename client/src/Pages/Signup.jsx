import SignupForm from "../components/SignupForm";
import {useNavigate} from "react-router-dom";

const Singup = () => {
  const navigate = useNavigate();
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
            id="myform"
          >
            <span className="text-3xl text-center pb-[15px] font-semibold">
              Sign Up
            </span>
            <SignupForm />
            <p className="text-center mt-5">
							Already have an account?{" "}
							<span className="text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>
								Sign in
							</span>
						</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Singup;
