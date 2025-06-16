import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProductsBySellerId } from "../api/productApi";
import {
  Package,
  ShoppingBag,
  BarChart2,
  PlusCircle,
  Settings,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// StatCard Component
const StatCard = ({ title, value, icon, change, bgColor }) => (
  <div className={`${bgColor} rounded-xl shadow-md p-6`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
          {value}
        </h3>
      </div>
      <div className="rounded-full p-3 bg-white/80 dark:bg-gray-800/50 shadow-sm">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className="text-xs font-medium text-green-600 dark:text-green-400">
        {change}
      </span>
      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
        from last month
      </span>
    </div>
  </div>
);

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.auth.userId);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats] = useState({
    views: 12345,
    revenue: 56789,
    pendingOrders: 5,
    completedOrders: 28,
    lowStockItems: 3,
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

        // Mock orders data - replace with actual API call
        setOrders([
          {
            id: 1,
            customer: "John Doe",
            product: "Product 1",
            amount: 1299,
            status: "Delivered",
            date: "2023-06-15",
          },
          {
            id: 2,
            customer: "Jane Smith",
            product: "Product 2",
            amount: 2499,
            status: "Processing",
            date: "2023-06-18",
          },
          {
            id: 3,
            customer: "Bob Johnson",
            product: "Product 3",
            amount: 999,
            status: "Pending",
            date: "2023-06-20",
          },
          {
            id: 4,
            customer: "Alice Brown",
            product: "Product 4",
            amount: 1899,
            status: "Delivered",
            date: "2023-06-12",
          },
          {
            id: 5,
            customer: "Charlie Wilson",
            product: "Product 5",
            amount: 3499,
            status: "Processing",
            date: "2023-06-19",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Helper functions
  const handleEditProduct = (productId) => {
    console.log("Edit product:", productId);
    // TODO: Implement edit functionality
    alert("Edit functionality will be implemented soon!");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log("Delete product:", productId);
      // TODO: Implement delete functionality
      alert("Delete functionality will be implemented soon!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Filter products based on search term
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
            {/* Stats Cards */}
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
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Recent Orders
                  </h3>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            ₹{order.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alerts & Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Alerts & Notifications
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Low Stock Alert
                      </h4>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        {stats.lowStockItems} products are running low on
                        inventory
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        New Order
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        You received a new order (#1005) worth ₹2,199
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                        Sales Milestone
                      </h4>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Congratulations! You've reached ₹50,000 in sales this
                        month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Product Performance
                </h3>
                <Link
                  to="#"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All Products
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Sales
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.slice(0, 5).map((product, index) => (
                      <tr
                        key={product.productId || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={`http://localhost:8080/images/${product.imageUrl}`}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/40?text=Product";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {product.category?.name || "Uncategorized"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              product.quantity > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : product.quantity > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {product.quantity > 0
                              ? `${product.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {Math.floor(Math.random() * 100)} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleEditProduct(product.productId)
                              }
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProduct(product.productId)
                              }
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Manage Products":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Manage Products
              </h3>
              <Link
                to="/addProduct"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Product
              </Link>
            </div>

            <div className="p-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Filter
                  </button>
                  <button
                    onClick={handleClearSearch}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.map((product, index) => (
                      <tr
                        key={product.productId || index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={`http://localhost:8080/images/${product.imageUrl}`}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/40?text=Product";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {product.category?.name || "Uncategorized"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              product.quantity > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : product.quantity > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {product.quantity > 0
                              ? `${product.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {product.category?.name || "Uncategorized"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleEditProduct(product.productId)
                              }
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProduct(product.productId)
                              }
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-500 dark:bg-gray-800 dark:text-gray-100 p-4 border-r-2 border-gray-300 dark:border-gray-700">
        <ul className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200
          ${
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

      {/* main  */}
      <div className="h-screen w-full overflow-y-auto">
        <div className="pt-8 px-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SellerDashboard;
