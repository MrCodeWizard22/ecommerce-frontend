import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    terms: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      if (response.status === 200) {
        setSuccessMessage("Registration successful. Please log in.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "USER",
          terms: false,
        });
        setTimeout(() => {
          navigate("/api/auth/login");
        }, 2000);
      } else {
        const errorMessage =
          response.data?.message || response.data || "Registration failed.";
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <select
                name="role"
                id="role"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">User</option>
                <option value="SELLER">Seller</option>
              </select>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    name="terms"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                    checked={formData.terms}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  type="submit"
                  className="w-1/2 mx-auto h-7 text-black dark:text-white text-sm ring-0 hover:ring-2 hover:ring-gray-600 dark:hover:ring-gray-400 focus:ring-2 focus:ring-gray-700 dark:focus:ring-gray-500 transition bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Create an account"}
                </button>
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to={"/api/auth/login"} className="text-primary-600">
                  Login here
                </Link>
                {/* </a> */}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
