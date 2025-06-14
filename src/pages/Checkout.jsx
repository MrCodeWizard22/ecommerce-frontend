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

const Checkout = () => {
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

  const handleAddToCart = (productId, quantity) => {
    if (userId) {
      dispatch(addToCart({ userId, productId, quantity }));
    }
  };

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

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      return;
    }

    // Calculate total price - ensure we're using numbers
    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
      0
    );
    
    console.log("Items for payment:", items);
    console.log("Total price calculated:", totalPrice);
    
    navigate("/payment", {
      state: {
        amount: totalPrice, // This is in rupees, will be converted to paise in Payment component
        items: items.map(item => ({
          productId: item.product.productId,
          quantity: item.quantity
        }))
      }
    });
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error: {JSON.stringify(error)}</p>
    );
    
  // Calculate total price - ensure we're using numbers
  const totalPrice = items.reduce(
    (sum, item) => sum + (Number(item.product.price) * Number(item.quantity)),
    0
  );
  
  // Function to display price correctly
  const displayPrice = (price) => {
    // If price is already in paise (large number), convert to rupees
    return price > 1000 ? (price / 100).toFixed(2) : price.toFixed(2);
  };
  
  return (
    <div className="container min-h-screen mx-auto p-6 dark:text-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Checkout
      </h1>
      {items.length === 0 ? (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Your cart is empty.
        </p>
      ) : (
        <div>
          <ul className="space-y-4">
            {items.map((item) => {
              const itemPrice = Number(item.product.price);
              const itemQuantity = Number(item.quantity);
              const subtotal = itemPrice * itemQuantity;
              
              return (
                <li
                  key={item.cartId}
                  className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <div>
                    <h2 className="text-xl font-semibold">{item.product.name}</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      ₹{displayPrice(itemPrice)} x {itemQuantity} = ₹{displayPrice(subtotal)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.cartId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Total:</h2>
            <p className="text-lg text-blue-600">₹{displayPrice(totalPrice)}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
