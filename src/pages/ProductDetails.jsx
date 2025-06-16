import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { getProductById } from "../api/productApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [quantity, setQuantity] = useState(1);

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
    if (!userId) {
      setNotification({
        show: true,
        message: "Please log in to add items to cart",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      return;
    }

    dispatch(
      addToCart({ userId, productId: product.productId, quantity })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setNotification({
          show: true,
          message: "Product added to cart successfully!",
          type: "success",
        });
      } else {
        setNotification({
          show: true,
          message: "Failed to add product to cart",
          type: "error",
        });
      }

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    });
  };

  const handleBuyNow = () => {
    navigate("/shipping", {
      state: {
        amount: product.price,
        productId: product.productId,
        quantity,
        items: [
          {
            productId: product.productId,
            quantity,
          },
        ],
        fromCheckout: false,
      },
    });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-800">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="container mx-auto p-6 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex justify-center bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg">
            <img
              src={`http://localhost:8080/images/${product.imageUrl}`}
              alt={product.name}
              className="w-80 h-80 md:w-96 md:h-96 object-contain rounded-xl"
            />
          </div>

          <div className="flex flex-col space-y-6 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <div className="flex items-center">
              <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                ₹{product.price}
              </span>
              <span
                className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${
                  product.quantity > 0
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                }`}
              >
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="text-lg text-gray-700 dark:text-gray-300">
              <h3 className="font-medium mb-2">Description:</h3>
              <p>{product.description}</p>
            </div>

            {product.quantity > 0 && (
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="quantity"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 p-2 border border-gray-300 rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.quantity} available
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {product.quantity > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add to Cart
                </button>
              )}

              {product.quantity > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Buy Now
                </button>
              )}
            </div>

            {product.quantity === 0 && (
              <p className="text-red-500 font-medium">
                This product is currently out of stock. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
