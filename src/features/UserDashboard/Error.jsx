import React from "react";

export const Error = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
        <p className="text-red-500 text-lg font-semibold mb-4">Error</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {message || "Something went wrong."}
        </p>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
};
