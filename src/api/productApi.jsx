import appClient from "./appClient";

// Fetch all products
export const getAllProducts = async () => {
  try {
    const response = await appClient.get("/products");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch product by ID
export const getProductById = async (id) => {
  try {
    const response = await appClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching product:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Add a new product (Requires Auth)
export const addProduct = async (product) => {
  try {
    const token = localStorage.getItem("token");
    const response = await appClient.post("/products", product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding product:",
      error.response?.data || error.message
    );
    throw error;
  }
};
