import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySellerId } from "../api/productApi";
// import Sidebar from "./Sidebar";
// import Stats from "./Stats";
// import ProductList from "./ProductList";
// import OrderList from "./OrderList";
// import RevenueStats from "./RevenueStats";
// import { fetchSellerData } from "../../redux/actions/sellerActions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const sellerData = useSelector((state) => state.seller);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.userId);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProductsBySellerId(userId)
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected an array but received:", data);
          setProducts([]);
        }
      })
      .catch((error) => console.error("Failed to fetch products:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
        <ul>
          <li className="mb-4">Dashboard</li>
          <li className="mb-4">Manage Products</li>
          <li className="mb-4">Orders</li>
          <li className="mb-4">Revenue</li>
        </ul>
      </div>
      <div className="flex-1 p-6">
        <div className="flex flex-wrap gap-6">
          {/* Stats Component */}
          <div className="w-full sm:w-1/2 md:w-1/3">stats</div>

          {/* Revenue Stats Component */}
          <div className="w-full sm:w-1/2 md:w-1/3">Revenue</div>

          {/* Product List */}
          <div className="w-full">
            Products {!loading ? products.length : "fuck you"}
          </div>

          {/* Order List */}
          <div className="w-full">Orders</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
