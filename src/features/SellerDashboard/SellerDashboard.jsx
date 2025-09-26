import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProductsBySellerId } from "../../api/productApi";
import { getSellerOrders } from "../../api/orderApi";
import {
  Package,
  ShoppingBag,
  BarChart2,
  Settings,
  Users,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Import modular components
import StatCard from "./components/StatCard";
import StockAlerts from "./components/StockAlerts";
import RecentOrdersTable from "./components/RecentOrdersTable";
import ProductPerformance from "./components/ProductPerformance";
import ManageProducts from "./components/ManageProducts";

// Helper function to convert order status codes to text
const getOrderStatusText = (statusCode) => {
  switch (statusCode) {
    case 0:
      return "Pending";
    case 1:
      return "Confirmed";
    case 2:
      return "Paid";
    case 3:
      return "Processing";
    case 4:
      return "Shipped";
    case 5:
      return "Delivered";
    case 6:
      return "Cancelled";
    case 7:
      return "Refunded";
    default:
      return "Unknown";
  }
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    views: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    lowStockOnlyItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const productsData = await getProductsBySellerId(userId);
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.error("Expected an array but received:", productsData);
          setProducts([]);
        }

        try {
          const ordersResponse = await getSellerOrders(userId);
          if (ordersResponse && ordersResponse.orders) {
            const transformedOrders = ordersResponse.orders.map((order) => {
              let customerName = "Unknown Customer";
              if (order.user?.name) {
                customerName = order.user.name;
              } else if (order.user?.email) {
                customerName = order.user.email;
              } else if (order.shippingDetails?.fullName) {
                customerName = order.shippingDetails.fullName;
              } else if (order.shippingDetails?.email) {
                customerName = order.shippingDetails.email;
              }
              return {
                id: order.orderId,
                customer: customerName,
                product:
                  order.orderItems
                    ?.map((item) => item.product?.productName)
                    .join(", ") || "Products",
                amount: order.orderTotal,
                status: getOrderStatusText(order.orderStatus),
                date: new Date(order.orderDate).toLocaleDateString(),
                orderItems: order.orderItems || [],
                originalOrder: order,
              };
            });
            setOrders(transformedOrders);

            const totalRevenue = transformedOrders.reduce(
              (sum, order) => sum + order.amount,
              0
            );
            const pendingOrders = transformedOrders.filter(
              (order) => order.status === "Pending"
            ).length;
            const completedOrders = transformedOrders.filter(
              (order) => order.status === "Delivered"
            ).length;

            setStats((prevStats) => ({
              ...prevStats,
              revenue: totalRevenue,
              pendingOrders,
              completedOrders,
            }));
          } else {
            setOrders([]);
          }
        } catch (orderError) {
          console.error("Failed to fetch seller orders:", orderError);
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (products.length > 0) {
      const outOfStockCount = products.filter(
        (product) => product.quantity === 0
      ).length;
      const lowStockCount = products.filter(
        (product) => product.quantity > 0 && product.quantity < 10
      ).length;
      const totalStockIssues = outOfStockCount + lowStockCount;
      setStats((prevStats) => ({
        ...prevStats,
        lowStockItems: totalStockIssues,
        outOfStockItems: outOfStockCount,
        lowStockOnlyItems: lowStockCount,
      }));
    }
  }, [products]);

  const menuItems = [
    { name: "Dashboard", icon: <BarChart2 size={20} /> },
    { name: "Manage Products", icon: <Package size={20} /> },
    { name: "Orders", icon: <ShoppingBag size={20} /> },
    { name: "Customers", icon: <Users size={20} /> },
    { name: "Analytics", icon: <TrendingUp size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "paid":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "processing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "shipped":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "delivered":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleEditProduct = (productId) => {
    alert("Edit functionality will be implemented soon!");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      alert("Delete functionality will be implemented soon!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₹${stats.revenue.toLocaleString()}`}
                icon={<BarChart2 className="h-6 w-6 text-blue-500" />}
                change="+12%"
                bgColor="bg-blue-50 dark:bg-blue-900/20"
              />
              <StatCard
                title="Total Products"
                value={products.length}
                icon={<Package className="h-6 w-6 text-purple-500" />}
                change="+5%"
                bgColor="bg-purple-50 dark:bg-purple-900/20"
              />
              <StatCard
                title="Total Orders"
                value={orders.length}
                icon={<ShoppingBag className="h-6 w-6 text-green-500" />}
                change="+8%"
                bgColor="bg-green-50 dark:bg-green-900/20"
              />
              <StatCard
                title="Total Views"
                value={stats.views.toLocaleString()}
                icon={<Users className="h-6 w-6 text-amber-500" />}
                change="+15%"
                bgColor="bg-amber-50 dark:bg-amber-900/20"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentOrdersTable
                orders={orders}
                getStatusColor={getStatusColor}
              />
              <StockAlerts stats={stats} products={products} />
            </div>
            <ProductPerformance
              products={products}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          </div>
        );
      case "Manage Products":
        return (
          <ManageProducts
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        );
      case "Orders":
        return <div>Orders Content</div>;
      case "Customers":
        return <div>Customers Content</div>;
      case "Settings":
        return <div>Settings Content</div>;
      default:
        return <div>Dashboard Content</div>;
    }
  };

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
    <div className="flex">
      <div className="w-64 h-screen bg-gray-500 dark:bg-gray-800 dark:text-gray-100 p-4 border-r-2 border-gray-300 dark:border-gray-700">
        <ul className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                activeTab === item.name
                  ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-screen w-full overflow-y-auto">
        <div className="pt-8 px-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SellerDashboard;
