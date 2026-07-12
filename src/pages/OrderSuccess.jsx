import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { Check, Compass, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const foundOrder = getOrderById(orderId);
    if (!foundOrder) {
      // If order not found, fallback
      navigate('/');
      return;
    }
    setOrder(foundOrder);
  }, [orderId, getOrderById, navigate]);

  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 min-h-[70vh] flex flex-col justify-center">
      
      {/* Animated Checkmark Circle */}
      <div className="relative w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/25"
        >
          <Check size={32} className="stroke-[3.5]" />
        </motion.div>
      </div>

      {/* Heading Success Message */}
      <div className="space-y-3">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          Baking is underway!
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          Your order has been received. Our chefs are hand-tossing your sourdough base right now.
        </p>
      </div>

      {/* Order Info Card summary */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm max-w-md mx-auto w-full space-y-4">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Order Reference</span>
          <span className="text-slate-800 font-extrabold">{order.id}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Payment Status</span>
          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-black uppercase text-[10px]">
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-50 pt-3">
          <span>Delivered To</span>
          <span className="text-slate-800 truncate max-w-[60%] font-bold">{order.address.split(',')[0]}</span>
        </div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-50 pt-3">
          <span>Grand Total</span>
          <span className="text-base font-black text-slate-900">₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto w-full">
        <Link
          to={`/track-order/${order.id}`}
          className="w-full sm:flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/35 transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Compass size={16} />
          <span>Track Live Order</span>
        </Link>
        <Link
          to="/menu"
          className="w-full sm:flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
        >
          <ShoppingBag size={16} />
          <span>Order More</span>
        </Link>
      </div>

    </div>
  );
}
