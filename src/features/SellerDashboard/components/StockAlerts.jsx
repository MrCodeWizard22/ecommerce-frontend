import React from "react";
import {
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

const StockAlerts = ({ stats, products }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Alerts & Notifications
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {/* Out of Stock Alert - Highest Priority */}
        {stats.outOfStockItems > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                🚨 Out of Stock Alert
              </h4>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {stats.outOfStockItems} products are completely out of stock
              </p>
              <div className="mt-2 space-y-1">
                {products
                  .filter((product) => product.quantity === 0)
                  .slice(0, 3)
                  .map((product) => (
                    <div
                      key={product.productId}
                      className="text-xs text-red-700 dark:text-red-300 font-medium"
                    >
                      • {product.name}: OUT OF STOCK
                    </div>
                  ))}
                {products.filter((product) => product.quantity === 0).length >
                  3 && (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    ...and{" "}
                    {products.filter((product) => product.quantity === 0)
                      .length - 3}{" "}
                    more out of stock
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert - Medium Priority */}
        {stats.lowStockOnlyItems > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                ⚠️ Low Stock Warning
              </h4>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                {stats.lowStockOnlyItems} products have less than 10 items in
                stock
              </p>
              <div className="mt-2 space-y-1">
                {products
                  .filter(
                    (product) => product.quantity > 0 && product.quantity < 10
                  )
                  .slice(0, 3)
                  .map((product) => (
                    <div
                      key={product.productId}
                      className="text-xs text-yellow-700 dark:text-yellow-300"
                    >
                      • {product.name}: {product.quantity} left
                    </div>
                  ))}
                {products.filter(
                  (product) => product.quantity > 0 && product.quantity < 10
                ).length > 3 && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    ...and{" "}
                    {products.filter(
                      (product) => product.quantity > 0 && product.quantity < 10
                    ).length - 3}{" "}
                    more low stock items
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Good - Only show if no stock issues */}
        {stats.outOfStockItems === 0 && stats.lowStockOnlyItems === 0 && (
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                ✅ Stock Levels Good
              </h4>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                All products have adequate stock levels
              </p>
            </div>
          </div>
        )}
        <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <ShoppingBag className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              New Order
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              You received a new order (#1005) worth ₹2,199
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
              Sales Milestone
            </h4>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Congratulations! You've reached ₹50,000 in sales this month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAlerts;
