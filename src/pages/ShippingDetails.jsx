import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShippingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    amount,
    items,
    productId,
    fromCheckout = false,
  } = location.state || {};
  const userId = useSelector((state) => state.auth.userId);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    deliveryInstructions: "",
  });

  const [errors, setErrors] = useState({});
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  // Load shipping methods on component mount
  useEffect(() => {
    // Set simple shipping methods
    const methods = [
      {
        name: "STANDARD",
        displayName: "Standard Delivery",
        cost: 50.0,
        minDeliveryDays: 5,
        maxDeliveryDays: 7,
      },
      {
        name: "EXPRESS",
        displayName: "Express Delivery",
        cost: 100.0,
        minDeliveryDays: 2,
        maxDeliveryDays: 3,
      },
      {
        name: "FREE",
        displayName: "Free Delivery",
        cost: 0.0,
        minDeliveryDays: 7,
        maxDeliveryDays: 10,
      },
    ];

    setShippingMethods(methods);
    setSelectedShippingMethod(methods[0].displayName);
  }, []);

  // Calculate shipping cost when method changes
  useEffect(() => {
    if (selectedShippingMethod && amount) {
      calculateShipping();
    }
  }, [selectedShippingMethod, amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  const handleShippingMethodChange = (e) => {
    setSelectedShippingMethod(e.target.value);
  };

  const calculateShipping = () => {
    if (!selectedShippingMethod || !amount) return;

    setCalculatingShipping(true);

    // Find the selected method
    const method = shippingMethods.find(
      (m) => m.displayName === selectedShippingMethod
    );
    if (method) {
      let cost = method.cost;

      // Free shipping for orders above ₹500 with Standard delivery
      if (amount >= 500 && method.name === "STANDARD") {
        cost = 0;
      }

      setShippingCost(cost);

      // Calculate estimated delivery
      const deliveryDays = method.maxDeliveryDays;
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
      setEstimatedDelivery(estimatedDate.toISOString());
    }

    setCalculatingShipping(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = "Name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    if (!shippingInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.pincode.trim()) newErrors.pincode = "Pincode is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingInfo.email && !emailRegex.test(shippingInfo.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (shippingInfo.phone && !phoneRegex.test(shippingInfo.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (shippingInfo.pincode && !pincodeRegex.test(shippingInfo.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    localStorage.setItem("shippingName", shippingInfo.fullName);
    localStorage.setItem("shippingPhone", shippingInfo.phone);
    localStorage.setItem("shippingAddress", shippingInfo.address);

    navigate("/payment", {
      state: {
        amount: amount + shippingCost,
        items,
        productId,
        fromCheckout,
        shippingInfo: {
          ...shippingInfo,
          shippingMethod: selectedShippingMethod,
          shippingCost,
          estimatedDelivery,
        },
      },
    });
  };

  const handleBack = () => {
    if (productId && !fromCheckout) {
      navigate(`/product/${productId}`);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen w-full dark:bg-gray-800">
      <div className="container mx-auto p-6 dark:text-white">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Shipping Details
        </h1>

        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows="3"
                  placeholder="Enter your full address"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your state"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingInfo.pincode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your pincode"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  readOnly
                />
              </div>
            </div>

            {/* Shipping Method Selection */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Shipping Method
              </h3>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={method.name}
                        name="shippingMethod"
                        value={method.displayName}
                        checked={selectedShippingMethod === method.displayName}
                        onChange={handleShippingMethodChange}
                        className="mr-3"
                      />
                      <label htmlFor={method.name} className="dark:text-white">
                        <div className="font-medium">{method.displayName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {method.minDeliveryDays === method.maxDeliveryDays
                            ? `${method.minDeliveryDays} day${
                                method.minDeliveryDays > 1 ? "s" : ""
                              }`
                            : `${method.minDeliveryDays}-${method.maxDeliveryDays} days`}
                        </div>
                      </label>
                    </div>
                    <div className="text-right">
                      <div className="font-medium dark:text-white">
                        {method.cost === 0 ? "Free" : `₹${method.cost}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {calculatingShipping && (
                <div className="mt-2 text-blue-600 dark:text-blue-400">
                  Calculating shipping cost...
                </div>
              )}

              {shippingCost > 0 && !calculatingShipping && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="text-blue-800 dark:text-blue-200">
                    Shipping Cost: ₹{shippingCost}
                  </div>
                  {estimatedDelivery && (
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                      Estimated Delivery:{" "}
                      {new Date(estimatedDelivery).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Instructions */}
            <div className="mt-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                value={shippingInfo.deliveryInstructions}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Any special delivery instructions..."
              />
            </div>

            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Subtotal:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Shipping:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                  </span>
                </div>
                <hr className="border-gray-300 dark:border-gray-600" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    ₹{amount + shippingCost}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {productId && !Array.isArray(items)
                  ? "Direct Purchase"
                  : `Items: ${items?.length || 0}`}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {productId && !fromCheckout
                  ? "Back to Product"
                  : "Back to Checkout"}
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
