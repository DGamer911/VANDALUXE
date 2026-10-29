import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import Contact from "./components/Contact";
import ProductDetails from "./pages/ProductDetails";
import CheckOut from "./pages/CheckOut";
import Login from "./admin/Login";
import AdminPanel from "./admin/AdminPanel";
import OrderDetails from "./admin/OrderDetails";
import Order from "./admin/Orders";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import PaymentCallback from "./pages/PaymentCallback";
import Catalogue from "./admin/Catalogue";  
import Settings from "./admin/Settings";  
import Analytics from "./admin/Analytics";
import Messages from "./admin/Messages";
import Notifications from "./admin/Notifications";

function App() {
  return (
    <div className="scroll-smooth bg-dark">
      <Routes>
        {/*Customer*/}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/collection" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/admin/login" element={<Login />} />


        {/*Admin*/}
        <Route element={<AdminLayout />}>
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/orders" element={<Order />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/admin/catalogue" element={<Catalogue/>} />
          <Route path="/admin/analytics" element={<Analytics/>} />
          <Route path="/admin/settings" element={<Settings/>} />
          <Route path="/admin/notifications" element={<Notifications/>} />
          <Route path="/admin/messages" element={<Messages/>} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
