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
    <Link to={`/product/${id}`}>
      <div className=" text-gray-900 dark:text-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg w-80 border border-gray-300 dark:border-b-cyan-800-700 transition">
        {/* Image Container */}
        <div className="w-full h-40 flex items-center justify-center">
          {console.log("imageUrl", imageUrl)}
          <img
            src={imageUrl || "https://via.placeholder.com/150"}
            alt={name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Text Content */}
        <div className="p-3">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
          <p className="text-md font-bold text-blue-500 mt-2">${price}</p>
          <p
            className={`text-sm font-medium mt-2 ${
              quantity > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {quantity > 0 ? `In Stock: ${quantity}` : "Out of Stock"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CardComponent;
