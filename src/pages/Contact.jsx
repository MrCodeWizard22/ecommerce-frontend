import React, { useState } from "react";
import { useSelector } from "react-redux";

const Contact = () => {
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/contact/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 dark:bg-gray-500 dark:text-white">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 dark:border-gray-500 "
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 dark:border-gray-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 dark:border-gray-500"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white py-2 rounded-lg hover:bg- transition duration-300 "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
