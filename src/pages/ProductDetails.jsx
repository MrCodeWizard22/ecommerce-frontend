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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {product.name}
      </h1>
      <div className="flex items-center justify-center mt-4">
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
          className="w-96 h-96 object-cover rounded-lg"
        />
      </div>
      <div className="mt-4">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          {product.description}
        </p>
        <p className="text-xl font-semibold text-blue-500 mt-2">
          ${product.price}
        </p>
        <p
          className={`text-lg font-medium mt-2 ${
            product.quantity > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.quantity > 0
            ? `In Stock: ${product.quantity}`
            : "Out of Stock"}
        </p>
      </div>
    </div>
  );
  //   return <h1>Product Details</h1>;
};
export default ProductDetails;
