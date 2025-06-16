import React, { useEffect, useState } from "react";
import CarouselCustomNavigation from "../components/Carousel";
import CardComponent from "../components/CardComponent";
import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Expected an array but received:", data);
          setProducts([]);
          setFilteredProducts([]);
        }
      })
      .catch((error) => console.error("Failed to fetch products:", error));

    getAllCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    filterProducts(categoryId, searchTerm);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(selectedCategory, term);
  };

  const filterProducts = (categoryId, term) => {
    let filtered = products;

    // Filter by category if selected
    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.category.categoryId == categoryId
      );
    }

    // Filter by search term if provided
    if (term) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.name.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-800 dark:text-white">
      {/* Hero Section with Carousel */}
      <section className="w-full">
        <CarouselCustomNavigation />
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className="flex-1 max-w-xs mx-auto sm:mx-0">
            <select
              name="category"
              id="category"
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 max-w-md mx-auto sm:mx-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 pr-10 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <CardComponent
                key={product.productId}
                id={product.productId}
                name={product.name}
                description={product.description}
                category={product.category}
                imageUrl={`http://localhost:8080/images/${product.imageUrl}`}
                price={product.price}
                quantity={product.quantity}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearchTerm("");
                  setFilteredProducts(products);
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
