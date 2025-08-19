import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orderApi";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to convert order status codes to text
  const getOrderStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "Pending";
      case 1:
        return "Confirmed";
      case 2:
        return "Processing";
      case 3:
        return "Shipped";
      case 4:
        return "Delivered";
      case 5:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Fetch order details
        const orderData = await getOrderById(orderId);
        setOrder(orderData);

        // Set shipping details from order data if available
        if (orderData && orderData.shippingDetails) {
          setShippingDetails(orderData.shippingDetails);
        }
      } catch (error) {
        setError("Failed to fetch order details");
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "paid":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-purple-600 bg-purple-100";
      case "shipped":
        return "text-indigo-600 bg-indigo-100";
      case "delivered":
        return "text-green-700 bg-green-200";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "in_transit":
        return "text-purple-600 bg-purple-100";
      case "out_for_delivery":
        return "text-orange-600 bg-orange-100";
      case "delivered":
        return "text-green-700 bg-green-200";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full dark:bg-gray-800">
      <div className="container mx-auto p-6 dark:text-white">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Order Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Order ID: #{order?.orderId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Order Date:
                </span>
                <span>{new Date(order?.orderDate).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                    getOrderStatusText(order?.orderStatus)
                  )}`}
                >
                  {getOrderStatusText(order?.orderStatus)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Payment Method:
                </span>
                <span>{order?.paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Payment Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                    order?.paymentStatus
                  )}`}
                >
                  {order?.paymentStatus || "Unknown"}
                </span>
              </div>

              <div className="flex justify-between font-semibold">
                <span className="text-gray-600 dark:text-gray-300">
                  Total Amount:
                </span>
                <span>₹{order?.orderTotal}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {shippingDetails && (
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Tracking Number:
                  </span>
                  <span className="font-mono">
                    {shippingDetails.trackingNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Delivery Status:
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getDeliveryStatusColor(
                      shippingDetails.deliveryStatus
                    )}`}
                  >
                    {shippingDetails.deliveryStatus
                      ?.replace("_", " ")
                      .toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping Method:
                  </span>
                  <span>{shippingDetails.shippingMethod}</span>
                </div>

                {shippingDetails.shippingCarrier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Carrier:
                    </span>
                    <span>{shippingDetails.shippingCarrier}</span>
                  </div>
                )}

                {shippingDetails.estimatedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Estimated Delivery:
                    </span>
                    <span>
                      {new Date(
                        shippingDetails.estimatedDeliveryDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {shippingDetails.actualDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Delivered On:
                    </span>
                    <span>
                      {new Date(
                        shippingDetails.actualDeliveryDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {shippingDetails.lastTrackingUpdate && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Latest Update:</strong>{" "}
                      {shippingDetails.lastTrackingUpdate}
                    </p>
                    {shippingDetails.lastTrackingUpdateTime && (
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        {new Date(
                          shippingDetails.lastTrackingUpdateTime
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        {order?.orderItems && (
          <div className="mt-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.orderItemId}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-4"
                >
                  <div className="flex items-center">
                    {item.productImageUrl && (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.productName}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Quantity: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {(order?.shippingAddress || shippingDetails) && (
          <div className="mt-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {shippingDetails ? (
              <div className="space-y-2">
                <p className="font-medium">{shippingDetails.fullName}</p>
                <p>{shippingDetails.addressLine1}</p>
                {shippingDetails.addressLine2 && (
                  <p>{shippingDetails.addressLine2}</p>
                )}
                <p>
                  {shippingDetails.city}, {shippingDetails.state}{" "}
                  {shippingDetails.pincode}
                </p>
                <p>{shippingDetails.country}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Phone: {shippingDetails.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Email: {shippingDetails.email}
                </p>
                {shippingDetails.deliveryInstructions && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm">
                      <strong>Delivery Instructions:</strong>{" "}
                      {shippingDetails.deliveryInstructions}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p>{order.shippingAddress}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
