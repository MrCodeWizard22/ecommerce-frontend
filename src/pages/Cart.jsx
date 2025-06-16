import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userId);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleUpdateQuantity = (cartId, quantity) => {
    dispatch(updateCartItemQuantity({ cartId, quantity }));
  };

  const handleRemoveFromCart = (cartId) => {
    dispatch(removeFromCart(cartId));
  };

  const handleClearCart = () => {
    if (userId) {
      dispatch(clearCart(userId));
    }
  };

  const handleQuantityChange = (cartId, quantity) => {
    setQuantities({ ...quantities, [cartId]: quantity });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-center text-lg font-semibold dark:text-white">
          Loading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg font-semibold mb-4">
            Backend Configuration Error
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {typeof error === "string" && error.includes("nesting depth")
              ? "The backend has circular reference issues. Please check entity relationships and add @JsonIgnore annotations."
              : error?.message ||
                error?.error ||
                "Unable to load cart items. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full dark:bg-gray-700 py-8">
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Your Cart
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your cart is empty.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b dark:border-gray-700 py-4"
                >
                  <div className="mb-3 md:mb-0">
                    <p className="text-lg font-medium dark:text-white">
                      {item.product.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Price: ₹{item.product.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      min={1}
                      type="number"
                      className="w-16 p-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={
                        quantities[item.cartId] === undefined
                          ? item.quantity
                          : quantities[item.cartId]
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          item.cartId,
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.cartId,
                          quantities[item.cartId] === undefined
                            ? item.quantity
                            : quantities[item.cartId]
                        )
                      }
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      onClick={() => handleRemoveFromCart(item.cartId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t dark:border-gray-700">
              <div className="text-right text-lg font-semibold mb-4 dark:text-white">
                Total: ₹{totalPrice.toFixed(2)}
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>

                <button
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
