import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createOrder,
  createOrderFromCart,
  createOrderWithPayment,
  verifyPayment,
} from "../api/paymentApi";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { amount, productId, quantity, items, shippingInfo, fromCheckout } =
    location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    // Redirect if no shipping info
    if (!shippingInfo && items && items.length > 0) {
      navigate("/shipping", {
        state: {
          amount,
          items,
        },
      });
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleBack = () => {
    setPendingOrderData(null);
    navigate(-1);
  };

  const handlePayment = async () => {
    if (!amount) {
      setError("Payment amount is missing");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const amountToSend = Math.round(amount);
      // console.log("Sending amount to backend:", amountToSend);
      // console.log("Payment state:", {
      //   amount,
      //   productId,
      //   quantity,
      //   items,
      //   shippingInfo,
      //   fromCheckout,
      // });

      let orderData;

      // Check if this is from cart checkout (fromCheckout = true)
      if (fromCheckout && items && Array.isArray(items) && shippingInfo) {
        // Create order from cart with shipping details
        const orderRequest = {
          userId: userId,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}`,
          paymentMethod: "Razorpay",
          shippingCost: shippingInfo.shippingCost || 0,
          shippingDetails: {
            fullName: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            addressLine1: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pincode: shippingInfo.pincode,
            country: shippingInfo.country,
            shippingMethod: shippingInfo.shippingMethod,
            deliveryInstructions: shippingInfo.deliveryInstructions,
            shippingCost: shippingInfo.shippingCost || 0,
            estimatedDelivery: shippingInfo.estimatedDelivery,
          },
        };

        orderData = await createOrderFromCart(orderRequest);
        // Store that this was a cart order for later cart clearing
        setPendingOrderData({ type: "cart" });
      } else if (items && Array.isArray(items) && shippingInfo && productId) {
        // Create order for direct purchase (Buy Now) with shipping details
        const orderRequest = {
          userId: userId,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}`,
          paymentMethod: "Razorpay",
          shippingCost: shippingInfo.shippingCost || 0,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: 0, // Will be fetched from product
          })),
          shippingDetails: {
            fullName: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            addressLine1: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pincode: shippingInfo.pincode,
            country: shippingInfo.country,
            shippingMethod: shippingInfo.shippingMethod,
            deliveryInstructions: shippingInfo.deliveryInstructions,
            shippingCost: shippingInfo.shippingCost || 0,
            estimatedDelivery: shippingInfo.estimatedDelivery,
          },
        };

        orderData = await createOrderWithPayment(orderRequest);
        setPendingOrderData({ type: "direct" });
      } else {
        // Create simple Razorpay order for basic payment
        orderData = await createOrder(amountToSend);
        setPendingOrderData(null);
      }

      // console.log("Order data received:", orderData);

      if (!orderData) {
        throw new Error("No order data received");
      }

      // Handle different response formats
      let razorpayOrderId, keyId, razorpayAmount, currency;

      if (orderData.razorpayOrder) {
        // Response from createOrderWithPayment or createOrderFromCart
        razorpayOrderId = orderData.razorpayOrder.orderId;
        keyId = orderData.razorpayOrder.keyId;
        razorpayAmount = orderData.razorpayOrder.amount;
        currency = orderData.razorpayOrder.currency;
      } else {
        // Response from simple createOrder
        razorpayOrderId = orderData.orderId;
        keyId = orderData.keyId;
        razorpayAmount = orderData.amount;
        currency = orderData.currency;
      }

      if (!razorpayOrderId) {
        throw new Error("No order ID in response");
      }

      setOrderId(razorpayOrderId);

      // Simple configuration focusing on card payments
      const options = {
        key: keyId,
        amount: razorpayAmount,
        currency: currency || "INR",
        name: "Quanta Shop",
        description: "Purchase Payment",
        order_id: razorpayOrderId,
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: localStorage.getItem("name") || "",
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("phone") || "",
        },
        theme: {
          color: "#3399cc",
        },
        notes: {
          test_mode: "This is a test payment. Use test card details.",
        },
      };

      // console.log("Razorpay options:", options);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK not loaded. Please refresh the page and try again."
        );
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError(
        "Payment processing failed: " +
          (error.message || "Please try again later.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);

      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };

      const result = await verifyPayment(verificationData);

      if (result?.status === "success") {
        if (pendingOrderData?.type === "cart") {
          dispatch(clearCart(userId));
        }
        alert("Payment successful! Your order has been placed.");
        navigate("/");
      } else {
        setError(result?.message || "Payment verification failed.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError(
        error.response?.data?.message ||
          "Payment verification failed. Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-[var(--text-color)]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Payment Details
        </h2>

        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Amount: ₹{amount}
          </p>
          {productId && (
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              Product ID: {productId}
            </p>
          )}
          {quantity && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Quantity: {quantity}
            </p>
          )}
          {items && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Items: {items.length}
            </p>
          )}

          {shippingInfo && (
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Order Breakdown:
              </p>
              <div className="text-sm mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{amount - (shippingInfo.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Shipping ({shippingInfo.shippingMethod || "Standard"}):
                  </span>
                  <span>
                    {shippingInfo.shippingCost === 0
                      ? "Free"
                      : `₹${shippingInfo.shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span>₹{amount}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Shipping to:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {shippingInfo.fullName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {shippingInfo.address}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {shippingInfo.city}, {shippingInfo.state}{" "}
                  {shippingInfo.pincode}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {shippingInfo.country}
                </p>
                <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                  Phone: {shippingInfo.phone}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>

          <button
            onClick={handleBack}
            disabled={loading}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
