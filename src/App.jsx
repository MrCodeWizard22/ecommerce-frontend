import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "./redux/cartSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProductRequests from "./pages/ProductRequests";
import Checkout from "./pages/Checkout";
import ShippingDetails from "./pages/ShippingDetails";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
function App() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/shipping" element={<ShippingDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SELLER"]}>
              {" "}
              <AddProduct />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/admin/product-requests" element={<ProductRequests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
