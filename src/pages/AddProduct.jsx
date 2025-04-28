import React, { useState, useEffect } from "react";
import { addProduct } from "../api/productApi.jsx";
import { getAllCategories } from "../api/categoryService.jsx";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    image: null,
    sellerId: "",
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if (data) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.sellerId) {
      setMessage("Seller ID is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("categoryId", product.categoryId);
    formData.append("image", product.image);
    formData.append("sellerId", product.sellerId);

    //clear the form after submission
    setProduct({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
      image: null,
      sellerId: "",
    });
    try {
      await addProduct(formData);
      setMessage("Product added successfully!");
      console.log("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product.");
    }
  };

  return (
    <div className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen flex flex-col items-center justify-center dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-[var(--text-color)] dark:text-white">
        Add New Product
      </h2>
      {message && <p className="mb-2 text-green-500">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-1/3 bg-[var(--background-color)] border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />

        {/* Dropdown for Category Selection */}
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        >
          <option value="">Select Category</option>
          {categories.length > 0 ? (
            categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="dark:bg-gray-900 dark:text-white"
              >
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <input
          type="number"
          name="sellerId"
          placeholder="Seller ID"
          value={product.sellerId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />

        <input
          type="file"
          required
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 dark:text-white rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-800"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
