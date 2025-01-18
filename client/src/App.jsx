import React from "react";
import { Routes, Route } from "react-router";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Singup from "./Pages/Signup";
import StudentAssignment from "./Pages/StudentAssignment";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Singup />} />
        <Route path="/studentAssignment/:id" element={<StudentAssignment />} />
      </Routes>
    </>
  );
};

export default App;
