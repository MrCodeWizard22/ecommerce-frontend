import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserOrders } from "../../api/orderApi";

export const useUserDashboard = () => {
  const { email, userId } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setUserProfile({
          name: email?.split("@")[0] || "User",
          email: email || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
        });

        const ordersResponse = await getUserOrders(userId);
        const transformedOrders =
          ordersResponse?.orders?.map((order) => ({
            id: order.orderId,
            date: order.orderDate,
            status: order.orderStatus,
            total: order.orderTotal,
            items: order.orderItems?.map((item) => ({
              name: item.product?.productName || "Product",
              quantity: item.quantity,
              price: item.price,
            })),
            trackingNumber: order.trackingNumber,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
          })) || [];

        setOrders(transformedOrders);
        setWishlist([]);
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, email]);

  return {
    loading,
    error,
    userProfile,
    setUserProfile,
    orders,
    wishlist,
    setWishlist,
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
  };
};
