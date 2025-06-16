import React from "react";
import { Link } from "react-router-dom";

const CardComponent = ({
  id,
  name,
  description,
  imageUrl,
  price,
  quantity,
}) => {
  return (
    <Link to={`/product/${id}`} className="w-full max-w-xs">
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105">
        {/* Image Container */}
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl || "https://via.placeholder.com/300x200"}
            alt={name}
            className="w-full h-full object-cover transition-transform hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x200?text=Image+Not+Found";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
            {name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₹{price}
            </span>

            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                quantity > 0
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              }`}
            >
              {quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardComponent;
