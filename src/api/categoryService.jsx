import axios from "axios";

export const getAllCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/categories");
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const searchCategry = async (keyword) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/categories/search/${keyword}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
// export const addCategory = async (category) => {
//     try{

//     }catch(error){
//         console.error(error);
//         return null;
//     }
// }
// export const deleteCategory = async (id) => {
//     try {
//         const response = await axios.delete(`http://localhost:8080/api/categories/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// }
