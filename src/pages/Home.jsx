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

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error("Failed to fetch products:", error));

    getAllCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  const handleChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) => product.category.categoryId == categoryId)
      );
    }
  };

  return (
    <div className="relative w-full h-auto p-4 dark:text-white dark:bg-gray-600">
      <div>
        <h1 className="text-2xl font-semibold text-center dark:text-white">
          Products
        </h1>
        <div className="flex justify-center mt-4">
          <select
            name="category"
            id="category"
            className="p-2 border border-gray-300 rounded-md"
            onChange={handleChange}
          >
            <option value="" className="dark:bg-gray-900 dark:text-white">
              All Categories
            </option>
            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId}
                className="dark:bg-gray-900
                dark:text-white"
              >
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded-md ml-4"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setFilteredProducts(
                products.filter(
                  (product) =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.name.toLowerCase().includes(searchTerm)
                )
              );
            }}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              const searchTerm = document
                .querySelector('input[type="text"]')
                .value.toLowerCase();
              setFilteredProducts(
                products.filter((product) =>
                  product.name.toLowerCase().includes(searchTerm)
                )
              );
            }}
          >
            Search
          </button>
        </div>
      </div>
      <CarouselCustomNavigation />
      <div className="mt-6 flex flex-wrap justify-center gap-5">
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
          <p className="text-center text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
