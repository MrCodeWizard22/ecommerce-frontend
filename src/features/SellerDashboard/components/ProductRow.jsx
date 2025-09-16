import React from "react";

const ProductRow = ({ product, handleEditProduct, handleDeleteProduct }) => {
  return (
    <tr
      key={product.productId}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-md object-cover"
              src={`http://localhost:8080/images/${product.imageUrl}`}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40?text=Product";
              }}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {product.category?.name || "Uncategorized"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        ₹{product.price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            product.quantity > 10
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : product.quantity > 0
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {product.quantity > 0
            ? `${product.quantity} in stock`
            : "Out of stock"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {product.category?.name || "Uncategorized"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditProduct(product.productId)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(product.productId)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
