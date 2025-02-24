import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { Logout } from "@mui/icons-material";
import Logout from "../pages/Logout";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  // const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const email = useSelector((state) => state.auth.email);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="w-full sm:py-1 bg-white/30 backdrop:blur-md border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        {" "}
        <Link to="/" className="flex items-center space-x-3">
          {/* Add your logo/brand here */}
          <span className="font-bold text-xl dark:text-white">
            Varshney's
          </span>{" "}
          {/* Example brand text */}
        </Link>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        {/* Dark Mode and Auth */}
        <div className="flex items-center space-x-4">
          {" "}
          {/* Combined for better alignment */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          {email ? (
            <>
              <span className="text-gray-700 md:text-lg dark:text-white">
                Welcome, {email}
              </span>
              <Logout />
            </>
          ) : (
            <>
              <Link to="/api/auth/login">
                <button className="px-3 py-1 sm:px-2 md:px-4 lg:px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <Link to="/api/auth/register">
                <button className="px-3 py-1 sm:px-2 md:px-4 lg:px-6 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
        {/* Navbar Links (Mobile-Friendly) */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto md:mt-0`}
        >
          <ul className="flex flex-col p-4 md:flex-row md:space-x-8 md:p-0 dark:text-white">
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="block py-2 px-3 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
