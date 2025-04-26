// src/pages/AdminDashboard.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [seller, setSellers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/admin/products",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );
    }
  };
  const fetchUsers = async () => {
    console.log(token);
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/admin/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
    }
  };
  const fetchSellers = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/admin/sellers",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setSellers(response.data);
    } catch (error) {
      console.error(
        "Error fetching sellers:",
        error.response?.data || error.message
      );
    }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/admin/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      setOrder(response.data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchProducts();
    fetchSellers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#1E1E2E] dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 dark:bg-[#2D3748] dark:text-[#A0AEC00] flex flex-col p-4 dark:border-r border-[#4A5568]">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a
            href="#"
            className="hover:bg-[#C77DFF] p-2 rounded active:text-[#E0E0E0] active:bg-[#A78BFA]"
          >
            Users
          </a>
          <a
            href="#"
            className="hover:bg-[#C77DFF] p-2 rounded active:text-[#E0E0E0] active:bg-[#A78BFA]"
          >
            Products
          </a>
          <a
            href="#"
            className="hover:bg-[#C77DFF] p-2 rounded active:text-[#E0E0E0] active:bg-[#A78BFA]"
          >
            Orders
          </a>
          <a
            href="#"
            className="hover:bg-[#C77DFF] p-2 rounded active:text-[#E0E0E0] active:bg-[#A78BFA]"
          >
            Sellers
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="shadow-md p-4 dark:bg-[#2D3748] dark:border border-[#4A5568]">
          <h1 className="text-xl font-semibold dark:text-[#E0E0E0]">
            Dashboard Overview
          </h1>
        </header>
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {/* Cards or Stats */}
            <div className="bg-white p-4 rounded shadow dark:bg-[#374151] dark:text-[#E0E0E0]">
              Total Users: {users.length}
            </div>
            <div className="bg-white p-4 rounded shadow dark:bg-[#374151] dark:text-[#E0E0E0]">
              Total Orders: {order.length}
            </div>
            <div className="bg-white p-4 rounded shadow dark:bg-[#374151] dark:text-[#E0E0E0]">
              Total Products: {products.length}
            </div>
            <div className="bg-white p-4 rounded shadow dark:bg-[#374151] dark:text-[#E0E0E0]">
              Total Sellers : {seller.length}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
