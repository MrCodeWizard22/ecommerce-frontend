import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../api/paymentApi";
import { useSelector } from "react-redux";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, productId, quantity, items, shippingInfo } =
    location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
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

      // Create order
      const orderData = await createOrder(amountToSend);
      console.log("Order data received:", orderData);

      if (!orderData) {
        throw new Error("No order data received");
      }

      const razorpayOrderId = orderData.orderId;

      if (!razorpayOrderId) {
        throw new Error("No order ID in response");
      }

      setOrderId(razorpayOrderId);

      // Simple configuration focusing on card payments
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
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
          // Payment successful
          alert("Payment successful!");
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
          <p className="text-lg font-semibold">Amount: ₹{amount}</p>
          {productId && <p className="text-sm mt-2">Product ID: {productId}</p>}
          {quantity && <p className="text-sm">Quantity: {quantity}</p>}
          {items && <p className="text-sm">Items: {items.length}</p>}

          {shippingInfo && (
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
              <p className="font-medium">Shipping to:</p>
              <p className="text-sm">{shippingInfo.fullName}</p>
              <p className="text-sm">{shippingInfo.address}</p>
              <p className="text-sm">
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pincode}
              </p>
              <p className="text-sm">{shippingInfo.country}</p>
              <p className="text-sm mt-1">Phone: {shippingInfo.phone}</p>
            </div>
          )}
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
