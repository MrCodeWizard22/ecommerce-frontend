import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { getProductById } from "../api/productApi";
import { API_URL } from "../config";

const ProductDetails = () => {
  // for route products/id
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => setProduct(data))
        .catch((error) => console.error("Failed to fetch product:", error));
    }
  }, [id]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const handleAddToCart = () => {
    if (userId == null) {
      showNotification("Please log in to add items to cart", "error");
      return;
    }

    dispatch(
      addToCart({ userId, productId: product.productId, quantity })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        showNotification("Product added to cart successfully!", "success");
      } else {
        showNotification("Failed to add product to cart", "error");
      }
    });
  };

  const handleBuyNow = () => {
    navigate("/shipping", {
      state: {
        amount: product.price,
        productId: product.productId,
        quantity,
        items: [{ productId: product.productId, quantity }],
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

  if (!product || !product.productId) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading product...</p>
    );
  }

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
          {/* Product Image */}
          <div className="flex justify-center bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg">
            <img
              src={`${API_URL}/images/${product.imageUrl}`}
              alt={product.name}
              className="w-80 h-80 md:w-96 md:h-96 object-contain rounded-xl"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold">{product.name}</h1>

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

            <div>
              <h3 className="font-medium mb-2">Description:</h3>
              <p>{product.description}</p>
            </div>

            {product.quantity > 0 && (
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 p-2 border rounded text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.quantity} available
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {product.quantity > 0 && role == "USER" && (
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600"
                >
                  Add to Cart
                </button>
              )}

              {product.quantity > 0 && role == "USER" && (
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600"
                >
                  Buy Now
                </button>
              )}
            </div>

            {product.quantity === 0 && (
              <p className="text-red-500 font-medium">
                This product is currently out of stock.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
