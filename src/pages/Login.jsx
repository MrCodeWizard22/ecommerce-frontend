import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );

      if (response.status === 200) {
        console.log(response.data);

        // Assuming response.data is an object like { token: "...", email: "..." }
        dispatch(
          login({ token: response.data.token, email: response.data.email })
        );
        navigate("/"); // This will redirect to the home page
      }
    } catch (error) {
      alert("Login failed. mail and password do not match");
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen dark:bg-gray-600">
        <form
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-80"
          onSubmit={handleSubmit} // Use onSubmit instead of onClick
        >
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full mt-1 p-2 border border-gray-300 dark:text-white rounded-md"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:text-white"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
            />
            <button
              type="submit" // This will trigger the form submission
              className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>

            <p className="mt-4 text-sm text-center dark:text-white">
              Don't have an account?{" "}
              <Link
                to="/api/auth/register"
                className="text-blue-500 dark:text-blue-300 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
