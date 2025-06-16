import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../pages/Logout";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const cartItemCount = useSelector((state) => state.cart.items.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const email = useSelector((state) => state.auth.email);
  const role = useSelector((state) => state.auth.role);

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
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-800 dark:text-white">
              Varshney's
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors"
              >
                {item}
              </Link>
            ))}

            {/* Dashboard Link - Only show when user is logged in */}
            {email && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <span className="text-xl" role="img" aria-label="Light mode">
                  ☀️
                </span>
              ) : (
                <span className="text-xl" role="img" aria-label="Dark mode">
                  🌙
                </span>
              )}
            </button>
            {/* cart  */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-3">
              {email ? (
                <>
                  <span className="text-gray-700 text-sm dark:text-white">
                    Welcome, {email.slice(0, email.indexOf("@"))}
                  </span>
                  <Logout />
                </>
              ) : (
                <Link
                  to="/api/auth/login"
                  className="text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:hidden mt-4 pb-2`}
        >
          <div className="flex flex-col space-y-3">
            {/* Mobile Navigation Links */}
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Mobile Dashboard Link - Only show when user is logged in */}
            {email && (
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile User Menu */}
            {!email ? (
              <Link
                to="/api/auth/login"
                className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="px-3 py-2 flex flex-col space-y-2 sm:hidden">
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {email.slice(0, email.indexOf("@"))}
                </span>
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
