import { useEffect } from "react";

const ProductRequests = () => {
  const [productRequest, setProductRequest] = useState([]);
  const token = localStorage.getItem("token");
  // requests
  const fetchProductRequest = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8080/api/product/requests/all",
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

  //   handle update
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
      fetchProductRequest();
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
    <div>
      <h1>Product Requests</h1>
      <p>Here you can manage product requests.</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4 dark:text-[#E0E0E0]">
          Product Requests
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-[#2D3748] border">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#4A5568]">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Seller Email</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productRequest.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="p-2">{req.name}</td>
                  <td className="p-2">{req.sellerEmail}</td>
                  <td className="p-2">{req.price}</td>
                  <td className="p-2">{req.category}</td>
                  <td className="p-2 capitalize">{req.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleStatusUpdate(req.id, "approved")}
                      className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "rejected")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
export default ProductRequests;
