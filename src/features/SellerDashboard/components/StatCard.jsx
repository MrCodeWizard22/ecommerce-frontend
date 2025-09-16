import React from "react";
import { BarChart2, Package, ShoppingBag, Users } from "lucide-react";

const StatCard = ({ title, value, icon, change, bgColor }) => {
  return (
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
};

export default StatCard;
