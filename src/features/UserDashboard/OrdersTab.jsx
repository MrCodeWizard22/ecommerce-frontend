import React from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from "lucide-react";

export const OrdersTab = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle size={16} className="text-green-600" />;
      case "processing":
        return <Clock size={16} className="text-blue-600" />;
      case "shipped":
        return <Package size={16} className="text-yellow-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      case "confirmed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-orange-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold dark:text-white">Order History</h3>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg dark:text-white">
                    Order #{order.id}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Placed on {order.date}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium dark:text-white">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold dark:text-white">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-700">
                  <p className="font-semibold text-lg dark:text-white">
                    Total: ₹{order.total}
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
