import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
} from "lucide-react";

const UserDashboard = ({ id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);

  // Redux state
  const { email, userId } = useSelector((state) => state.auth);

  // User data state
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

  // Orders state (mock data for now)
  const [orders, setOrders] = useState([]);

  // Wishlist state (mock data for now)
  const [wishlist, setWishlist] = useState([]);

  const menuItems = [
    { name: "Profile", icon: <User size={18} /> },
    { name: "Orders", icon: <ShoppingBag size={18} /> },
    { name: "Wishlist", icon: <Heart size={18} /> },
    { name: "Addresses", icon: <MapPin size={18} /> },
    { name: "Payment Methods", icon: <CreditCard size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Mock user profile data - replace with actual API call
        setUserProfile({
          name: email?.split("@")[0] || "User",
          email: email || "",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        });

        // Mock orders data - replace with actual API call
        setOrders([
          {
            id: "ORD-001",
            date: "2024-06-10",
            status: "Delivered",
            total: 1299,
            items: [{ name: "Wireless Headphones", quantity: 1, price: 1299 }],
          },
          {
            id: "ORD-002",
            date: "2024-06-08",
            status: "Processing",
            total: 2499,
            items: [{ name: "Smartphone", quantity: 1, price: 2499 }],
          },
          {
            id: "ORD-003",
            date: "2024-06-05",
            status: "Shipped",
            total: 999,
            items: [{ name: "Bluetooth Speaker", quantity: 1, price: 999 }],
          },
        ]);

        // Mock wishlist data - replace with actual API call
        setWishlist([]);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, email]);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "processing":
        return <Clock size={16} className="text-blue-600" />;
      case "shipped":
        return <Package size={16} className="text-yellow-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const handleProfileEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileSave = () => {
    // TODO: Implement API call to save profile
    console.log("Saving profile:", userProfile);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    alert("Item removed from wishlist!");
  };

  // Render functions
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold dark:text-white">
          Profile Information
        </h3>
        <button
          onClick={isEditing ? handleProfileSave : handleProfileEdit}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? (
            <>
              <Save size={16} />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit size={16} />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={userProfile.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={userProfile.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={userProfile.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={userProfile.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={userProfile.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            value={userProfile.state}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold dark:text-white">Order History</h3>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg dark:text-white">
                    Order #{order.id}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Placed on {order.date}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium dark:text-white">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold dark:text-white">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                  <p className="font-semibold text-lg dark:text-white">
                    Total: ₹{order.total}
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold dark:text-white">My Wishlist</h3>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Your wishlist is empty
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Package size={32} className="text-gray-400" />
                </div>
              </div>

              <h4 className="font-semibold text-lg dark:text-white mb-2">
                {item.name}
              </h4>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ₹{item.price}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.inStock
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>

                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  disabled={!item.inStock}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return renderProfile();
      case "Orders":
        return renderOrders();
      case "Wishlist":
        return renderWishlist();
      case "Addresses":
        return (
          <div className="text-center py-8">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Address management coming soon!
            </p>
          </div>
        );
      case "Payment Methods":
        return (
          <div className="text-center py-8">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Payment methods coming soon!
            </p>
          </div>
        );
      case "Settings":
        return (
          <div className="text-center py-8">
            <Settings size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Settings coming soon!
            </p>
          </div>
        );
      default:
        return renderProfile();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
          <p className="text-red-500 text-lg font-semibold mb-4">Error</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            User Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome, {userProfile.name}
          </p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200 ${
                activeTab === item.name
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-8 px-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
