import React from "react";
import axios from "axios";
import { API_URL } from "../../../config";

const MessageTable = ({ messages, token, fetchData }) => {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${API_URL}/api/contact/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (!messages) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Message</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700">
          {messages.map((msg, idx) => (
            <tr key={msg.id || idx}>
              <td className="px-4 py-2 border-b">{msg.id || idx + 1}</td>
              <td className="px-4 py-2 border-b">{msg.name}</td>
              <td className="px-4 py-2 border-b">{msg.email}</td>
              <td className="px-4 py-2 border-b">{msg.message}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {messages.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No messages found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MessageTable;
