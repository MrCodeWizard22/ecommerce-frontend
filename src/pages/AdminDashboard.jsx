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
  const [productRequests, setProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [notifications, setNotifications] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Helper functions for order status
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

  const getOrderStatusColor = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 1:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 2:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 3:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case 4:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 5:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        ordersRes,
        productsRes,
        sellersRes,
        requestsRes,
        categoriesRes,
      ] = await Promise.all([
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
        axios.get("http://localhost:8080/api/products/requests/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setSellers(sellersRes.data);
      setProductRequests(requestsRes.data);
      setCategories(categoriesRes.data);

      // Set notification count based on pending requests
      const pendingRequests = requestsRes.data.filter(
        (req) => req.status === 0
      );
      setNotifications(pendingRequests.length);
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

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/products/requests/approve?requestId=${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh data after approval
      fetchData();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/products/requests/reject?requestId=${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh data after rejection
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Product CRUD functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/admin/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchData();
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  // User CRUD functions
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  // Seller management functions
  const handleViewSellerProducts = (sellerId) => {
    // Filter products by seller and show them
    const sellerProducts = products.filter(
      (p) => p.seller?.userId === sellerId
    );
    alert(
      `This seller has ${sellerProducts.length} products. Feature to view detailed list coming soon!`
    );
  };

  const handleToggleSellerStatus = async (seller) => {
    const action = seller.active ? "suspend" : "activate";
    if (window.confirm(`Are you sure you want to ${action} this seller?`)) {
      try {
        // For now, we'll use the user update endpoint to change status
        const updatedUser = { ...seller, active: !seller.active };
        await axios.put(
          `http://localhost:8080/api/admin/users/${seller.userId}`,
          updatedUser,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchData();
        alert(`Seller ${action}d successfully!`);
      } catch (error) {
        console.error(`Error ${action}ing seller:`, error);
        alert(`Failed to ${action} seller`);
      }
    }
  };

  // Order management functions
  const handleViewOrder = (order) => {
    alert(
      `Order Details:\nID: ${order.orderId}\nCustomer: ${
        order.user?.firstName
      } ${order.user?.lastName}\nTotal: ₹${
        order.orderTotal
      }\nStatus: ${getOrderStatusText(order.orderStatus)}\nDate: ${new Date(
        order.orderDate
      ).toLocaleDateString()}`
    );
  };

  const handleUpdateOrderStatus = async (orderId, currentStatus) => {
    const statusOptions = [
      { value: "PENDING", label: "Pending" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "PAID", label: "Paid" },
      { value: "PROCESSING", label: "Processing" },
      { value: "SHIPPED", label: "Shipped" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "REFUNDED", label: "Refunded" },
    ];

    const newStatus = prompt(
      `Current status: ${getOrderStatusText(
        currentStatus
      )}\n\nSelect new status:\n${statusOptions
        .map((s, i) => `${i + 1}. ${s.label}`)
        .join("\n")}\n\nEnter number (1-8):`
    );

    if (newStatus && newStatus >= 1 && newStatus <= 8) {
      const selectedStatus = statusOptions[newStatus - 1].value;
      try {
        await axios.put(
          `http://localhost:8080/api/admin/orders/${orderId}/status`,
          { status: selectedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
        alert("Order status updated successfully!");
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("Failed to update order status");
      }
    }
  };

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
                {/* Recent Users */}
                {users.slice(-3).map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Users
                        size={18}
                        className="text-blue-600 dark:text-blue-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        New user: {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Recent Product Requests */}
                {productRequests.slice(-2).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      <Package
                        size={18}
                        className="text-yellow-600 dark:text-yellow-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        Product request: {request.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        By {request.seller?.firstName}{" "}
                        {request.seller?.lastName}
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
                    {orders.slice(-5).map((order) => (
                      <tr
                        key={order.orderId}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          #{order.orderId}
                        </td>
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="py-2 text-sm text-gray-800 dark:text-gray-200">
                          ₹{order.orderTotal}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {getOrderStatusText(order.orderStatus)}
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
      case "Users":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Users Management ({users.length} users)
                </h3>
                <button
                  onClick={handleAddUser}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.userId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Sellers":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Sellers Management ({sellers.length} sellers)
                </h3>
                <button
                  onClick={handleAddUser}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Add Seller
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sellers.map((seller) => (
                      <tr
                        key={seller.userId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {seller.firstName} {seller.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {seller.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {
                            products.filter(
                              (p) => p.seller?.userId === seller.userId
                            ).length
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditUser(seller)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleViewSellerProducts(seller.userId)
                            }
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Products
                          </button>
                          <button
                            onClick={() => handleToggleSellerStatus(seller)}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          >
                            Suspend
                          </button>
                          <button
                            onClick={() => handleDeleteUser(seller.userId)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "Products":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Products Management ({products.length} products)
                </h3>
                <button
                  onClick={handleAddProduct}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.slice(0, 10).map((product) => (
                      <tr
                        key={product.productId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={`http://localhost:8080/images/${product.imageUrl}`}
                              alt={product.productName}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.productName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {product.category?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {product.seller?.firstName} {product.seller?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              product.quantity < 10
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
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
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Orders Management ({orders.length} orders)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.slice(0, 10).map((order) => (
                      <tr
                        key={order.orderId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ₹{order.orderTotal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {getOrderStatusText(order.orderStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(
                                order.orderId,
                                order.orderStatus
                              )
                            }
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            Update Status
                          </button>
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
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Pending Product Requests ({notifications})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {productRequests
                      .filter((req) => req.status === 0)
                      .map((request) => (
                        <tr
                          key={request.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={`http://localhost:8080/images/${request.imageUrl}`}
                                alt={request.name}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {request.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Qty: {request.quantity}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {request.seller?.firstName}{" "}
                            {request.seller?.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ₹{request.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {request.category?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {productRequests.filter((req) => req.status === 0).length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No pending product requests
                  </div>
                )}
              </div>
            </div>
          </div>
        );
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

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowProductModal(false)}
          onSave={() => {
            fetchData();
            setShowProductModal(false);
          }}
          token={token}
        />
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowUserModal(false)}
          onSave={() => {
            fetchData();
            setShowUserModal(false);
          }}
          token={token}
        />
      )}
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

// Product Modal Component
const ProductModal = ({ product, categories, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    quantity: product?.quantity || "",
    categoryId: product?.category?.categoryId || "",
    imageUrl: product?.imageUrl || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: { categoryId: parseInt(formData.categoryId) },
      };

      if (product) {
        // Update existing product
        await axios.put(
          `http://localhost:8080/api/admin/products/${product.productId}`,
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Product updated successfully!");
      } else {
        // Create new product
        await axios.post(
          "http://localhost:8080/api/admin/products",
          productData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Product created successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              {product ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Modal Component
const UserModal = ({ user, onClose, onSave, token }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "USER",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        ...formData,
        // Only include password if it's provided (for new users or password updates)
        ...(formData.password && { password: formData.password }),
      };

      if (user) {
        // Update existing user
        await axios.put(
          `http://localhost:8080/api/admin/users/${user.userId}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("User updated successfully!");
      } else {
        // Create new user
        if (!formData.password) {
          alert("Password is required for new users");
          return;
        }
        await axios.post("http://localhost:8080/api/admin/users", userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User created successfully!");
      }
      onSave();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {user ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="USER">User</option>
              <option value="SELLER">Seller</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              Password {user && "(leave blank to keep current)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              {...(!user && { required: true })}
            />
          </div>
          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              {user ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
