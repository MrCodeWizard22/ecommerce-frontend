import appClient from "./appClient";

// Create a Razorpay order
export const createOrder = async (amount) => {
  try {
    const response = await appClient.post("/payments/create-order", { amount });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create order from cart with shipping details
export const createOrderFromCart = async (orderData) => {
  try {
    const response = await appClient.post(
      "/payments/create-order-from-cart",
      orderData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order from cart:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create order with payment integration
export const createOrderWithPayment = async (orderRequest) => {
  try {
    const response = await appClient.post(
      "/payments/create-order-with-payment",
      orderRequest
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating order with payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData) => {
  try {
    const response = await appClient.post(
      "/payments/verify-payment",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
