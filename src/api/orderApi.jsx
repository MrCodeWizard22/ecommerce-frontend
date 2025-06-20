import appClient from "./appClient";

// Get all orders for a user
export const getUserOrders = async (userId) => {
  try {
    const response = await appClient.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error.response?.data || error.message);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await appClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await appClient.post("/orders/create", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error.response?.data || error.message);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await appClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId, reason) => {
  try {
    const response = await appClient.put(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error.response?.data || error.message);
    throw error;
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const response = await appClient.get("/orders/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error.response?.data || error.message);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (status) => {
  try {
    const response = await appClient.get(`/orders/status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by status:", error.response?.data || error.message);
    throw error;
  }
};

// Get seller orders
export const getSellerOrders = async (sellerId) => {
  try {
    const response = await appClient.get(`/orders/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller orders:", error.response?.data || error.message);
    throw error;
  }
};
