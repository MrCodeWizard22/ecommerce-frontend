import React from "react";
import { Users, Package } from "lucide-react";

const RecentActivity = ({ users, productRequests }) => {
  return (
    <div className="col-span-full lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {/* Recent Users */}
        {users.slice(-3).map((user) => (
          <div
            key={user.userId}
            className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Users size={18} className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                New user: {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        ))}

        {/* Recent Product Requests */}
        {productRequests.slice(-2).map((request) => (
          <div
            key={request.id}
            className="flex items-start space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <Package
                size={18}
                className="text-yellow-600 dark:text-yellow-300"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                Product request: {request.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By {request.seller?.firstName} {request.seller?.lastName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
