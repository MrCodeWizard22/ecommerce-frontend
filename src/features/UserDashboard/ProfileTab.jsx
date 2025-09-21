import React from "react";

export const ProfileTab = ({ userProfile }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-white">
          Profile Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["name", "email", "phone", "address", "city", "state"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={userProfile[field]}
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
