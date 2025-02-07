import React from "react";

const CardComponent = ({ title, description }) => {
  return (
    <div className="bg-white  p-6 rounded-lg shadow-lg w-90 h-48">
      <h2 className="text-xl font-bold mb-2 text-gray-900 ">{title}</h2>
      <p className="text-gray-600 ">{description}</p>
    </div>
  );
};

export default CardComponent;
