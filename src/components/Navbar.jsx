import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

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
    <nav className="w-full bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between p-4 w-full">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
        </a>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>

        {/* Navbar Links */}
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex flex-col p-4 md:flex-row md:space-x-8 md:p-0 md:mt-0 dark:text-white">
            {["Home", "About", "Services", "Pricing", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block py-2 px-3 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
