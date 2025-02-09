import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
