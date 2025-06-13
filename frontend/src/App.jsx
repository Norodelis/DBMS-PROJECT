import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Staff from './Staff';
import Admin from './Admin';
import Customer from './Customer';
import ViewCart from "./ViewCart";
import ViewFavorites from "./ViewFavorites";
import CheckoutForm from "./CheckoutForm";
import Profile from "./Profile";
import TrackOrder from "./TrackOrder";
import ForgotPassword from './ForgotPassword';
import CustomerLayout from "./CustomerLayout";
import Inventory from "./Inventory";
import ProductList from "./ProductList";
import OrderList from "./OrderList";
import SalesReport from "./SalesReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/staff" element={<Inventory />} />
        <Route path="/admin" element={<Inventory />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sales-report" element={<SalesReport />} />

        {/* Customer routes with Navbar */}
        <Route element={<CustomerLayout />}>
          <Route path="/customer" element={<Customer />} />
          <Route path="/view-cart" element={<ViewCart />} />
          <Route path="/view-favorites" element={<ViewFavorites />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/track-order" element={<TrackOrder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;