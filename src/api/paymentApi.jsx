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

// Create order from cart with shipping details
export const createOrderFromCart = async (orderData) => {
  try {
    console.log("Creating order from cart:", orderData);
    const response = await appClient.post(
      "/payments/create-order-from-cart",
      orderData
    );
    console.log("Order from cart response:", response.data);
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
    console.log("Creating order with payment:", orderRequest);
    const response = await appClient.post(
      "/payments/create-order-with-payment",
      orderRequest
    );
    console.log("Order with payment response:", response.data);
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
