import { useEffect, useState } from "react";
import axios from "axios";

const ProductRequests = () => {
  const [productRequest, setProductRequest] = useState([]);
  const token = localStorage.getItem("token");

  // requests
  const fetchProductRequest = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/products/requests/all",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setProductRequest(response.data);
    } catch (error) {
      console.error(
        "Error fetching product requests:",
        error.response?.data || error.message
      );
    }
  };

  // Handle status update
  const handleStatusUpdate = async (requestId, status) => {
    try {
      const url =
        status === "approved"
          ? "http://localhost:8080/api/products/requests/approve"
          : "http://localhost:8080/api/products/requests/reject";

      await axios.post(
        `${url}?requestId=${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProductRequest((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProductRequest();
  }, []);

  return (
    <div className="dark:bg-gray-600 min-h-screen">
      <h1 className="dark:text-white text-3xl font-semibold text-center py-4">
        Product Requests
      </h1>
      <p className="text-center text-lg dark:text-[#E0E0E0] mb-8">
        Here you can manage product requests.
      </p>

      <section className="mt-8 px-4">
        <h2 className="text-xl font-semibold mb-4 dark:text-[#E0E0E0]">
          Product Requests
        </h2>
        <div className="overflow-x-auto bg-white dark:bg-[#2D3748] rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#4A5568]">
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Name
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Seller Email
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Price for One
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Quantity
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Category
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Status
                </th>
                <th className="p-2 text-left text-sm font-medium text-gray-700 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {productRequest.map((req) => {
                const categoryColor =
                  req?.category?.name === "Electronics"
                    ? "bg-blue-100 dark:bg-blue-600"
                    : req?.category?.name === "Clothing"
                    ? "bg-green-100 dark:bg-green-600"
                    : "bg-gray-100 dark:bg-gray-600";

                return (
                  <tr key={req.id} className={`border-t ${categoryColor}`}>
                    <td className="p-2 dark:text-white">{req?.name}</td>
                    <td className="p-2">{req?.seller?.email}</td>
                    <td className="p-2">{req?.price}</td>
                    <td className="p-2">{req?.quantity}</td>
                    <td className="p-2">{req?.category?.name}</td>
                    <td className="p-2 capitalize">{req?.status}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(req?.id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(req?.id, "rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProductRequests;
