import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItems } from "../redux/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleProceedToShipping = () => {
    if (items.length === 0) {
      return;
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
      0
    );

    navigate("/shipping", {
      state: {
        amount: totalPrice,
        items: items.map((item) => ({
          productId: item.product.productId,
          quantity: item.quantity,
        })),
        fromCheckout: true, // Explicitly mark as coming from checkout
      },
    });
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error: {JSON.stringify(error)}</p>
    );

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.quantity),
    0
  );

  const displayPrice = (price) => {
    return price > 1000 ? (price / 100).toFixed(2) : price.toFixed(2);
  };

  return (
    <div className="min-h-screen w-full dark:bg-gray-800">
      <div className="container mx-auto p-6 dark:text-white">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h1>
        {items.length === 0 ? (
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Your cart is empty.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                  Items in Your Order
                </h2>
                <ul className="space-y-4">
                  {items.map((item) => {
                    const itemPrice = Number(item.product.price);
                    const itemQuantity = Number(item.quantity);
                    const subtotal = itemPrice * itemQuantity;

                    return (
                      <li
                        key={item.cartId}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div>
                          <h3 className="text-lg font-medium">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Quantity: {itemQuantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 dark:text-gray-300">
                            ₹{displayPrice(itemPrice)} × {itemQuantity}
                          </p>
                          <p className="font-semibold">
                            ₹{displayPrice(subtotal)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                  Price Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="dark:text-gray-300">
                      Price ({items.length} items)
                    </p>
                    <p className="dark:text-white">
                      ₹{displayPrice(totalPrice)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="dark:text-gray-300">Delivery Charges</p>
                    <p className="text-green-500">Free</p>
                  </div>
                  <div className="border-t dark:border-gray-600 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <p className="dark:text-white">Total Amount</p>
                      <p className="dark:text-white">
                        ₹{displayPrice(totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleProceedToShipping}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                  >
                    Proceed to Shipping
                  </button>
                  <button
                    onClick={handleBackToCart}
                    className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-3 rounded-lg transition-colors"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
