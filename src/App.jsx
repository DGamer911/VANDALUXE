import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductDetails from "./pages/ProductDetails";
import CheckOut from "./pages/CheckOut";

import Cart from "./pages/Cart"

import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="bg-dark scroll-smooth">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element ={<Cart/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/collection" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
