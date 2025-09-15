import React from "react";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Profile", icon: <User size={18} /> },
  { name: "Orders", icon: <ShoppingBag size={18} /> },
  { name: "Wishlist", icon: <Heart size={18} /> },
  { name: "Addresses", icon: <MapPin size={18} /> },
  { name: "Payment Methods", icon: <CreditCard size={18} /> },
  { name: "Settings", icon: <Settings size={18} /> },
];

export const Sidebar = ({ activeTab, setActiveTab, userName }) => (
  <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        User Dashboard
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Welcome, {userName}
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
);
