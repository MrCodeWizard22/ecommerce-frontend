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
  Bell,
} from "lucide-react";

// Import modular components
import DashboardContent from "./components/DashboardContent";
import UsersTable from "./components/UsersTable";
import SellersTable from "./components/SellersTable";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import ProductRequestsTable from "./components/ProductRequestsTable";
import ProductModal from "./components/ProductModal";
import UserModal from "./components/UserModal";

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
      fetchData();
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

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

  const handleViewSellerProducts = (sellerId) => {
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
          <DashboardContent
            users={users}
            orders={orders}
            products={products}
            sellers={sellers}
            productRequests={productRequests}
            getOrderStatusText={getOrderStatusText}
            getOrderStatusColor={getOrderStatusColor}
          />
        );
      case "Users":
        return (
          <UsersTable
            users={users}
            handleAddUser={handleAddUser}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
          />
        );
      case "Sellers":
        return (
          <SellersTable
            sellers={sellers}
            products={products}
            handleAddUser={handleAddUser}
            handleEditUser={handleEditUser}
            handleViewSellerProducts={handleViewSellerProducts}
            handleToggleSellerStatus={handleToggleSellerStatus}
            handleDeleteUser={handleDeleteUser}
          />
        );
      case "Products":
        return (
          <ProductsTable
            products={products}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        );
      case "Orders":
        return (
          <OrdersTable
            orders={orders}
            getOrderStatusText={getOrderStatusText}
            getOrderStatusColor={getOrderStatusColor}
            handleViewOrder={handleViewOrder}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case "Product Requests":
        return (
          <ProductRequestsTable
            productRequests={productRequests}
            handleApproveRequest={handleApproveRequest}
            handleRejectRequest={handleRejectRequest}
            notifications={notifications}
          />
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

export default AdminDashboard;
