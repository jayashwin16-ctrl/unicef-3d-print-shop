import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Problem from "./pages/Problem";
import Stats from "./pages/Stats";
import WhyUnicef from "./pages/WhyUnicef";
import Donate from "./pages/Donate";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import CheckoutPaymentError from "./pages/CheckoutPaymentError";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem" element={<Problem />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/why" element={<WhyUnicef />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
        <Route path="/checkout/payment-error" element={<CheckoutPaymentError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
