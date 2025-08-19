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
  const [pendingOrderData, setPendingOrderData] = useState(null); // Store order data until payment success
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
    // Clear pending order data when going back
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
      console.log("Sending amount to backend:", amountToSend);
      console.log("Payment state:", {
        amount,
        productId,
        quantity,
        items,
        shippingInfo,
        fromCheckout,
      });

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

      console.log("Order data received:", orderData);

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

      console.log("Razorpay options:", options);

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
      console.log("Payment success response:", response);

      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };

      console.log("Sending verification data:", verificationData);

      try {
        const result = await verifyPayment(verificationData);
        console.log("Verification result:", result);

        if (result && result.status === "success") {
          // Payment verified successfully
          console.log("Payment verified successfully!");

          // Clear cart from frontend state if this was a cart checkout
          if (pendingOrderData && pendingOrderData.type === "cart") {
            console.log("Clearing cart from frontend state for user:", userId);
            dispatch(clearCart(userId));
          }

          alert("Payment successful! Your order has been placed.");

          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          setError("Payment verification failed. Please contact support.");
        }
      } catch (verifyError) {
        console.error("Verification request failed:", verifyError);

        alert(
          "Your payment was processed, but we couldn't verify it. Please check your email for confirmation."
        );
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError("Payment verification failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-color)] text-[var(--text-color)]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>

        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-lg font-semibold">Total Amount: ₹{amount}</p>
          {productId && <p className="text-sm mt-2">Product ID: {productId}</p>}
          {quantity && <p className="text-sm">Quantity: {quantity}</p>}
          {items && <p className="text-sm">Items: {items.length}</p>}

          {shippingInfo && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
              <p className="font-medium">Order Breakdown:</p>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{amount - (shippingInfo.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({shippingInfo.shippingMethod}):</span>
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

              <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                <p className="font-medium">Shipping to:</p>
                <p className="text-sm">{shippingInfo.fullName}</p>
                <p className="text-sm">{shippingInfo.address}</p>
                <p className="text-sm">
                  {shippingInfo.city}, {shippingInfo.state}{" "}
                  {shippingInfo.pincode}
                </p>
                <p className="text-sm">{shippingInfo.country}</p>
                <p className="text-sm mt-1">Phone: {shippingInfo.phone}</p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

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
