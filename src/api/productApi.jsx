import appClient from "./appClient";

export const getAllProducts = async () => {
  try {
    const response = await appClient.get("/products");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getProductById = async (id) => {
  try {
    const response = await appClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const addProduct = async (product) => {
  try {
    const response = await appClient.post("/products", product);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
