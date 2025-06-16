import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  Package,
  Store,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [notifications, setNotifications] = useState(3); // Example notification count
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes, productsRes, sellersRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/admin/sellers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setSellers(sellersRes.data);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <BarChart2 size={20} /> },
    { name: "Users", icon: <Users size={20} /> },
    { name: "Sellers", icon: <Store size={20} /> },
    { name: "Orders", icon: <ShoppingBag size={20} /> },
    { name: "Products", icon: <Package size={20} /> },
    { name: "Product Requests", icon: <Bell size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={users.length}
              icon={<Users className="h-8 w-8 text-blue-500" />}
              change="+12%"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              title="Total Orders"
              value={orders.length}
              icon={<ShoppingBag className="h-8 w-8 text-green-500" />}
              change="+5%"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              title="Total Products"
              value={products.length}
              icon={<Package className="h-8 w-8 text-purple-500" />}
              change="+8%"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
            <StatCard
              title="Total Sellers"
              value={sellers.length}
              icon={<Store className="h-8 w-8 text-amber-500" />}
              change="+3%"
              bgColor="bg-amber-50 dark:bg-amber-900/20"
            />

            {/* Recent Activity */}
            <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Users
                        size={18}
                        className="text-gray-600 dark:text-gray-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Recent Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Order ID
                      </th>
                      <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Customer
                      </th>
                      <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          #ORD-{1000 + i}
                        </td>
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          Customer {i}
                        </td>
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          ₹{(Math.random() * 1000).toFixed(2)}
                        </td>
                        <td className="py-2">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Product Requests":
        return <div>Product Requests Content</div>;
      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.name
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === "Product Requests" && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/api/auth/login");
            }}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {activeTab}
            </h1>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
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

export default AdminDashboard;
