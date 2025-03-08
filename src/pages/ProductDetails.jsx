import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../api/productApi";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((error) => console.error("Failed to fetch product:", error));
  }, []);

  return (
    <div className="container min-h-screen mx-auto p-6 dark:text-white dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <img
            src={product.image || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-3">
            {product.description}
          </p>
          <p className="text-2xl font-semibold text-blue-600 mt-4">
            ${product.price}
          </p>
          <p
            className={`text-lg font-medium mt-3 ${
              product.quantity > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.quantity > 0
              ? `In Stock: ${product.quantity}`
              : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
