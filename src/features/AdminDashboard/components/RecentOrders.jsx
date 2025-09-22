import React from "react";

const RecentOrders = ({ orders, getOrderStatusText, getOrderStatusColor }) => {
  return (
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
                  {order.shippingDetails?.fullName.toUpperCase()}
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
  );
};

export default RecentOrders;
