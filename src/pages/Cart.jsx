import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, Tag, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getGST,
    getGrandTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  const hasItems = cart.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      
      {/* Title */}
      <div className="text-left mb-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Shopping Bag</h1>
        <p className="text-sm text-slate-500 mt-1">Review your customized selections before checking out.</p>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns: Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-100"
                />

                {/* Item Details */}
                <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
                  <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                    {item.name}
                  </h3>
                  
                  {/* Customizations summary */}
                  <div className="text-xs text-slate-400 font-semibold space-x-2">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.size}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.crust}</span>
                  </div>

                  {item.toppings.length > 0 && (
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      <span className="font-extrabold text-slate-400 uppercase tracking-wider block sm:inline mr-1 text-[9px]">Toppings:</span>
                      {item.toppings.join(', ')}
                    </p>
                  )}
                </div>

                {/* Price, Quantity, Delete Row */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t border-slate-50 pt-4 sm:pt-0 sm:border-0">
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-slate-800 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Calculated Item Total Price */}
                  <div className="text-right sm:w-20">
                    <span className="text-base font-black text-slate-900">
                      ₹{(item.customizedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Pricing Breakdown & Promo */}
          <div className="space-y-6">
            
            {/* Promo Code Tray */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Apply Promo Coupon</h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Tag size={16} className="text-emerald-600" />
                    <div>
                      <span className="text-xs font-black text-emerald-800 uppercase">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">Discount applied</span>
                    </div>
                  </div>
                  <button onClick={handleRemoveCoupon} className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-lg cursor-pointer">
                    <X size={14} className="stroke-[3]" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. PIZZA20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-red-500 text-white px-4 py-2 text-xs font-black rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-[10px] text-red-500 font-bold">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-600 font-bold">{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Checkout Bill</h3>
              
              <div className="space-y-3.5 text-sm font-semibold text-slate-600 border-b border-slate-50 pb-4">
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
                  <span>Delivery Charge</span>
                  <span className="text-slate-800">
                    {getDeliveryFee() === 0 ? <span className="text-emerald-600 font-bold">Free</span> : `₹${getDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Grand Total</span>
                  <span className="text-2xl font-black text-slate-900">₹{getGrandTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm transition-all cursor-pointer flex items-center space-x-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/35 transform hover:-translate-y-0.5"
                >
                  <span>Checkout</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white border border-slate-100 rounded-3xl max-w-md mx-auto"
        >
          <span className="text-6xl block mb-6">🍕</span>
          <h3 className="text-xl font-black text-slate-800">Your bag is empty</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            Looks like you haven't added any of our stone-baked sourdough pizzas yet.
          </p>
          <Link
            to="/menu"
            className="inline-block mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/25"
          >
            Explore Menu
          </Link>
        </motion.div>
      )}

    </div>
  );
}
