import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages imports
import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaDetails from './pages/PizzaDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import Receipt from './pages/Receipt';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#fbfbfd]">
        {/* Sticky Header Navbar */}
        <div className="print:hidden">
          <Navbar />
        </div>

        {/* Main Pages Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/pizza/:id" element={<PizzaDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/track-order/:orderId" element={<TrackOrder />} />
            <Route path="/receipt/:orderId" element={<Receipt />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
