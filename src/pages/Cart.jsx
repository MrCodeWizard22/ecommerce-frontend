import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";

function Cart() {
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

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error: {JSON.stringify(error)}</p>
    );
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.cartId}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <p className="text-lg font-medium">{item.product.name}</p>
              <p className="text-gray-600">Price: ${item.product.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                min={1}
                type="number"
                className="w-16 p-1 border rounded text-center"
                value={
                  quantities[item.cartId] === undefined
                    ? item.quantity
                    : quantities[item.cartId]
                }
                onChange={(e) =>
                  handleQuantityChange(item.cartId, parseInt(e.target.value))
                }
              />
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveFromCart(item.cartId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
        {userId && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleAddToCart(1, 1)}
          >
            Add Product 1
          </button>
        )}
      </div>
      <div className="text-right text-lg font-semibold mt-4">
        Total: ₹{totalPrice.toFixed(2)}
      </div>
    </div>
  );
}

export default Cart;
