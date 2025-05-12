import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { getProductById } from "../api/productApi";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((error) => console.error("Failed to fetch product:", error));
  }, [id]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const response = await axios.get(
          `http://localhost:8080/api/auth/id?email=${email}`,
          {
            // Send email as query parameter
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserId(response.data);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleAddToCart = () => {
    if (userId) {
      dispatch(
        addToCart({ userId, productId: product.productId, quantity: 1 })
      );
    } else {
      console.error("User ID not available.");
    }
  };

  return (
    <div className="container min-h-screen mx-auto p-6 dark:text-white dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          {/* {console.log("product", product.imageUrl)} */}
          <img
            src={`http://localhost:8080/images/${product.imageUrl}`}
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
            ₹{product.price}
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

          {/* Add to Cart Button */}
          {product.quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
