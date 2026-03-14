import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
