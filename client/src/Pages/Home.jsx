import React from "react";
import { Button } from 'primereact/button'; 
import { toast } from "react-toastify";
import useAuthContext from "../hooks/useAuthContext";

const Home = () => {
    const { dispatch } = useAuthContext();
    const handleLogout = async () => {
        try{
            const response = await fetch("http://localhost:3000/auth/logout");
            if(response.ok)
                toast.success("Logged Out");       

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            dispatch({ type: "LOGOUT" });
        }catch(err){
            console.log(err); 
        }
    }

    return (
        <div>
        <h1>Home Page</h1>
        <Button label="Click" onClick={handleLogout} />
        </div>
    );
};

export default Home;
