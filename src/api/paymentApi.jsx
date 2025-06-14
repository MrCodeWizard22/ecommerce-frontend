import appClient from "./appClient";

// Create a Razorpay order
export const createOrder = async (amount) => {
  try {
    console.log("Creating order with amount:", amount);
    const response = await appClient.post("/payments/create-order", { amount });
    console.log("Order creation response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData) => {
  try {
    console.log("Verifying payment with data:", paymentData);
    const response = await appClient.post(
      "/payments/verify-payment",
      paymentData
    );
    console.log("Verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
