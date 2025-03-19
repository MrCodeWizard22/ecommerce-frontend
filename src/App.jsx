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

function App() {
  // yaha ye karne ka seedha matlab hai ki navbar me cart ka count dikhana hai aur waha fetchCartItems jo kar rahe the wo
  // ek async function hai jisme time lagta aur poora app pehele hi render ho raha the jisse cart ki length 0 aa rahi thi
  // isliye useEffect me dispatch kiya hai yaha par
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
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
