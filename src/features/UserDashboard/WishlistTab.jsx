import React from "react";
import { Heart, Package, X } from "lucide-react";

export const WishlistTab = ({ wishlist, setWishlist }) => {
  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    alert("Item removed from wishlist!");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold dark:text-white">My Wishlist</h3>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Your wishlist is empty
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <Package size={32} className="text-gray-400" />
              </div>

              <h4 className="font-semibold text-lg dark:text-white mb-2">
                {item.name}
              </h4>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ₹{item.price}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.inStock
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </span>

                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  disabled={!item.inStock}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                             hover:bg-blue-700 transition-colors 
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
