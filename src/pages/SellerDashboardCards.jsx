import { DollarSign, Package, ShoppingCart, BarChart } from "lucide-react"; // You can use other icon libraries too
import React from "react";
const DashboardCards = ({
  products = [],
  orders = [],
  revenue = 0,
  stats = {},
}) => {
  return (
    <div className="flex-1 p-6 dark:bg-gradient-to-br from-gray-800 to-gray-700 dark:text-white bg-gray-100 text-gray-800 min-h-screen">
      <div className="flex flex-wrap gap-6">
        {/* Stats Card */}
        <div className="w-full sm:w-1/2 md:w-1/3 bg-white dark:bg-slate-800 shadow-md rounded-xl p-5">
          <div className="flex items-center gap-4">
            <BarChart className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Total Views
              </p>
              <h2 className="text-2xl font-bold">{stats.views || 12345}</h2>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="w-full sm:w-1/2 md:w-1/3 bg-white dark:bg-slate-800 shadow-md rounded-xl p-5">
          <div className="flex items-center gap-4">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Monthly Revenue
              </p>
              <h2 className="text-2xl font-bold">₹{revenue || 56789}</h2>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="w-full sm:w-1/2 md:w-1/3 bg-white dark:bg-slate-800 shadow-md rounded-xl p-5">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Products
              </p>
              <h2 className="text-2xl font-bold">{products.length}</h2>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="w-full sm:w-1/2 md:w-1/3 bg-white dark:bg-slate-800 shadow-md rounded-xl p-5">
          <div className="flex items-center gap-4">
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Total Orders
              </p>
              <h2 className="text-2xl font-bold">{orders.length}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
