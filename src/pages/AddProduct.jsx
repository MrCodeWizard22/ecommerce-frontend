import React, { useState } from "react";
import { addProduct } from "../api/productApi.jsx";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(product);
      setMessage("Product added successfully!");
      setProduct({ name: "", description: "", price: "", quantity: "" }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product.");
    }
  };

  return (
    <div className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4 text-[var(--text-color)]">
        Add New Product
      </h2>
      {message && <p className="mb-2 text-green-500">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="w-1/3 bg-[var(--background-color)] border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-400 dark:border-gray-600 rounded mb-2 bg-[var(--background-color)] text-[var(--text-color)]"
          required
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
