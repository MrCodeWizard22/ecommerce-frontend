import React from "react";
import { Edit, Save } from "lucide-react";

export const ProfileTab = ({
  userProfile,
  setUserProfile,
  isEditing,
  setIsEditing,
}) => {
  const handleProfileEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileSave = () => {
    // TODO: API call to save profile
    console.log("Saving profile:", userProfile);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-white">
          Profile Information
        </h3>
        <button
          onClick={isEditing ? handleProfileSave : handleProfileEdit}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? (
            <>
              <Save size={16} />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit size={16} />
              <span>Edit</span>
            </>
          )}
        </button>
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
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                         disabled:bg-gray-100 dark:disabled:bg-gray-800"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
