import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { ArrowLeft, CreditCard, Wallet, Landmark, MapPin, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getSubtotal, getDiscount, getDeliveryFee, getGST, getGrandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();

  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card' | 'UPI' | 'Cash'
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    // If cart is empty, send back to menu
    if (cart.length === 0) {
      navigate('/menu');
    }

    // Prefill form if user is logged in
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
    }
  }, [user, cart, navigate, setValue]);

  const onSubmit = async (data) => {
    const deliveryAddress = useCustomAddress || !user || user.addresses.length === 0
      ? `${data.street}, ${data.city}, ${data.zipCode}`
      : user.addresses[selectedAddressIndex];

    const orderData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: deliveryAddress,
      items: cart,
      subtotal: getSubtotal(),
      gst: getGST(),
      deliveryFee: getDeliveryFee(),
      discount: getDiscount(),
      total: getGrandTotal()
    };

    try {
      const newOrder = await placeOrder(orderData, paymentMethod);
      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Server error.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex items-center space-x-2 mb-10">
        <Link to="/cart" className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Billing & Delivery</h1>
          <p className="text-sm text-slate-500 mt-0.5">Fill in details and complete your checkout payment.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Profile Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Contact Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                />
                {errors.name && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.name.message}</span>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                />
                {errors.email && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.email.message}</span>}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
              />
              {errors.phone && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.phone.message}</span>}
            </div>
          </div>

          {/* Delivery Location Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3 flex justify-between items-center">
              <span>Delivery Address</span>
              {user && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseCustomAddress(!useCustomAddress)}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {useCustomAddress ? 'Use Saved Address' : 'Use Custom Address'}
                </button>
              )}
            </h3>

            {/* Saved Address list (renders if logged in) */}
            {user && user.addresses.length > 0 && !useCustomAddress ? (
              <div className="space-y-3">
                {user.addresses.map((address, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start space-x-3 ${
                      selectedAddressIndex === idx
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 ${selectedAddressIndex === idx ? 'text-red-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-800">Address Option #{idx + 1}</span>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{address}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Custom Address Form fields
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    {...register('street', { required: useCustomAddress || !user ? 'Street is required' : false })}
                    placeholder="123 Sourdough Lane, Apt 4B"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  {errors.street && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.street.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      {...register('city', { required: useCustomAddress || !user ? 'City is required' : false })}
                      placeholder="New York"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    {errors.city && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.city.message}</span>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Zip Code</label>
                    <input
                      type="text"
                      {...register('zipCode', { required: useCustomAddress || !user ? 'Zip Code is required' : false })}
                      placeholder="10001"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    {errors.zipCode && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.zipCode.message}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Google Map Mockup placeholder */}
            <div className="pt-4 space-y-2">
              <label className="text-xs font-bold text-slate-400 block">Live Delivery Coverage Map</label>
              <div className="w-full h-40 bg-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-200/50">
                {/* SVG Mock Map Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Diagonal streets */}
                  <path d="M-50 80 L500 80 M-50 150 L500 150 M120 -50 L120 300" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                  {/* Greenery circles */}
                  <circle cx="80" cy="50" r="18" fill="#d1fae5" />
                  <circle cx="300" cy="110" r="14" fill="#d1fae5" />
                </svg>
                
                {/* Ping mark */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                    📍
                  </div>
                  <span className="bg-slate-900/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md mt-1 shadow border border-slate-800">
                    DIALED DELIVERY ZONE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method UI Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Payment Options</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  paymentMethod === 'Card'
                    ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <CreditCard size={18} />
                <span className="text-[10px] block uppercase font-extrabold tracking-wider">Credit Card</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  paymentMethod === 'UPI'
                    ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Wallet size={18} />
                <span className="text-[10px] block uppercase font-extrabold tracking-wider">UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  paymentMethod === 'Cash'
                    ? 'border-red-500 bg-red-50/20 text-red-500 font-bold'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Landmark size={18} />
                <span className="text-[10px] block uppercase font-extrabold tracking-wider">Cash on Del.</span>
              </button>
            </div>

            {/* Sub-form fields based on Payment selection */}
            {paymentMethod === 'Card' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="•••• •••• •••• 4242"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">CVV / Code</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    placeholder="•••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="pt-2 text-center bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">SCAN OR PAY WITH ID</span>
                <div className="w-24 h-24 bg-white rounded-xl mx-auto border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                  {/* Simulating QR Code with simple boxes */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 w-full h-full opacity-70">
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-white rounded" />
                    <div className="bg-white rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-slate-900 rounded" />
                    <div className="bg-white rounded" />
                    <div className="bg-slate-900 rounded" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="name@upi"
                  className="w-full max-w-xs mx-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 text-center"
                />
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <div className="pt-2 text-center bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-xs text-slate-600 font-bold block">
                  Please keep exact change ready. You will pay our delivery driver in cash upon handoff.
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Place button */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Order Summary</h3>
          
          {/* Items Summary list */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2">
                <div className="max-w-[70%]">
                  <span className="font-extrabold text-slate-800">{item.name}</span>
                  <span className="text-slate-400 font-semibold block text-[10px] mt-0.5">
                    {item.quantity}x {item.size} ({item.crust})
                  </span>
                </div>
                <span className="font-black text-slate-700">₹{(item.customizedPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing Ledger */}
          <div className="space-y-3.5 text-xs font-semibold text-slate-500 border-b border-slate-50 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800">₹{getSubtotal().toFixed(2)}</span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-₹{getDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="text-slate-800">₹{getGST().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-slate-800">
                {getDeliveryFee() === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${getDeliveryFee().toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-end border-b border-slate-50 pb-4">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Total Amount</span>
            <span className="text-xl font-black text-slate-900">₹{getGrandTotal().toFixed(2)}</span>
          </div>

          {/* Place Order Trigger */}
          <button
            type="submit"
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/35 transform hover:-translate-y-0.5"
          >
            <CheckCircle size={16} />
            <span>Place Order (₹{getGrandTotal().toFixed(2)})</span>
          </button>
        </div>

      </form>

    </div>
  );
}
