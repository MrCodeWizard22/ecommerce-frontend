import React from "react";

export const ProfileTab = ({ userProfile }) => {
  if (!userProfile) return null;

  const fields = [
    { key: "userId", label: "User ID" },
    { key: "username", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-white">
          Profile Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              name={field.key}
              value={userProfile[field.key] || ""}
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
