import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySellerId } from "../api/productApi";
// import Sidebar from "./Sidebar";
// import Stats from "./Stats";
// import ProductList from "./ProductList";
// import OrderList from "./OrderList";
// import RevenueStats from "./RevenueStats";
// import { fetchSellerData } from "../../redux/actions/sellerActions";
import DashboardCards from "../pages/SellerDashboardCards";

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

  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-500 dark:bg-gray-800 dark:text-gray-100 p-4 border-r-2 border-gray-300 dark:border-gray-700">
        <ul className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {["Dashboard", "Manage Products", "Orders", "Revenue"].map((item) => (
            <li
              key={item}
              onClick={() => setActiveTab(item)}
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200
          ${
            activeTab === item
              ? "bg-gray-300 dark:bg-gray-700 font-semibold"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* main  */}
      <div className="h-screen w-full overflow-y-auto">
        <DashboardCards
          products={products}
          orders={[]}
          revenue={0}
          stats={{}}
        />
      </div>
    </div>
  );
};

export default Dashboard;
