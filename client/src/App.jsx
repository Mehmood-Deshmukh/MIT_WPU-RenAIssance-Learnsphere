import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
      }
      try {
        const getToken = JSON.parse(localStorage.getItem("token"));
        const token = `Bearer ${getToken}`;
        console.log(token);
        const response = await axios.post(
          "http://localhost:3000/auth/authenticate-user",
          {},
          { headers: { Authorization: token } }
        );
        console.log(response.status);
      } catch (err) {
        console.log(err);
        navigate("/auth/login");
      }
    };
    authUser();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-semibold">Hello World</h1>
      <h1>This is the homepage and accessing this is protected</h1>
    </div>
  );
};

export default App;
