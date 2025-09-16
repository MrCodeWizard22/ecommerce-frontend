import React from "react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import { Users, ShoppingBag, Package, Store, BarChart2 } from "lucide-react";

const DashboardContent = ({
  users,
  orders,
  products,
  sellers,
  productRequests,
  getOrderStatusText,
  getOrderStatusColor,
}) => {
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
      <RecentActivity users={users} productRequests={productRequests} />
      <RecentOrders
        orders={orders}
        getOrderStatusText={getOrderStatusText}
        getOrderStatusColor={getOrderStatusColor}
      />
    </div>
  );
};

export default DashboardContent;
