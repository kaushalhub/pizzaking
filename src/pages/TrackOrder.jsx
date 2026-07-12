import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { db } from '../services/db';
import { Clock, Phone, MapPin, Award, CheckCircle2, Circle, Compass, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrder() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);

  // Read order state and register listener for background status simulator
  const fetchOrder = () => {
    const found = getOrderById(orderId);
    if (found) {
      setOrder(found);
    } else {
      db.getOrders().then(res => {
        const f = res.find(o => o.id === orderId);
        if (f) setOrder(f);
      }).catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchOrder();

    // Listen to background order update dispatch events
    window.addEventListener("ph_orders_updated", fetchOrder);
    return () => {
      window.removeEventListener("ph_orders_updated", fetchOrder);
    };
  }, [orderId, getOrderById]);

  if (!order) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
    </div>
  );

  const statusSteps = [
    { title: "Order Received", desc: "We received your order and payment", status: "Received" },
    { title: "Preparing Crust", desc: "Chefs are hand-stretching the sourdough", status: "Preparing" },
    { title: "Baking Pizza", desc: "Baked in stone-deck ovens at 400°C", status: "Baking" },
    { title: "Out for Delivery", desc: "On the way to your dining table", status: "Out for Delivery" },
    { title: "Delivered", desc: "Delivered hot and fresh!", status: "Delivered" }
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);

  // Delivery rider details
  const deliveryBoy = {
    name: "Alex Mercer",
    phone: "+1 (555) 348-1120",
    vehicle: "Eco Electric Scooter (License #AGY-34)",
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  };

  // Determine delivery boy position on SVG map based on status
  // 0: Received, 1: Preparing, 2: Baking -> Scooter is at restaurant
  // 3: Out for Delivery -> Scooter is halfway
  // 4: Delivered -> Scooter is at home
  const getScooterCoordinates = () => {
    if (currentStatusIndex <= 2) {
      return { x: 50, y: 50 }; // Restaurant location
    } else if (currentStatusIndex === 3) {
      return { x: 180, y: 110 }; // Scurrying along street
    } else {
      return { x: 300, y: 150 }; // Delivered to customer home
    }
  };

  const scooterPos = getScooterCoordinates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb Header */}
      <div className="text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400">Order Reference: {order.id}</span>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-0.5">Live Order Tracker</h1>
        </div>
        <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-2xl">
          <Clock size={14} className="text-red-500 animate-pulse" />
          <span>Estimated Delivery: 25 - 35 Mins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Timeline Tracking details */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-4">Timeline Progress</h3>
          
          <div className="relative pl-6 space-y-8">
            {/* Timeline vertical bar */}
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 pointer-events-none" />
            
            {statusSteps.map((step, idx) => {
              const isCompleted = idx < currentStatusIndex;
              const isActive = idx === currentStatusIndex;
              const isPending = idx > currentStatusIndex;
              
              return (
                <div key={idx} className="relative flex items-start space-x-4">
                  {/* Status Indicator Icon Dot */}
                  <div className="absolute -left-[20px] bg-white p-0.5 rounded-full z-10">
                    {isCompleted && (
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow shadow-red-500/20">
                        <CheckCircle2 size={16} className="stroke-[3]" />
                      </div>
                    )}
                    {isActive && (
                      <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center ring-4 ring-amber-500/20 shadow">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-2.5 h-2.5 bg-white rounded-full"
                        />
                      </div>
                    )}
                    {isPending && (
                      <div className="w-6 h-6 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                        <Circle size={10} className="fill-slate-100" />
                      </div>
                    )}
                  </div>

                  {/* Status Texts */}
                  <div className="pl-4">
                    <h4 className={`text-sm font-extrabold leading-none ${
                      isActive ? 'text-slate-800' : isCompleted ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-xs mt-1.5 leading-relaxed ${
                      isActive ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Map & Driver Details */}
        <div className="space-y-6">
          
          {/* Live SVG map tracker card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Live Driver Map</h3>
            
            <div className="w-full h-52 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
              {/* Map grid streets */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="trackGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#trackGrid)" />
                {/* Streets routes */}
                <path d="M 50 50 L 180 50 L 180 150 L 300 150" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 50 50 L 180 50 L 180 150 L 300 150" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>

              {/* Restaurant marker */}
              <div className="absolute top-8 left-10 text-center select-none z-10">
                <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center border border-white text-xs shadow-sm">
                  🏬
                </div>
                <span className="text-[8px] bg-slate-900 text-white font-black px-1.5 py-0.5 rounded shadow mt-1 block w-max mx-auto border border-slate-800">
                  PIZZAKING
                </span>
              </div>

              {/* Customer Home marker */}
              <div className="absolute bottom-8 right-10 text-center select-none z-10">
                <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border border-white text-xs shadow-sm">
                  🏠
                </div>
                <span className="text-[8px] bg-emerald-900 text-white font-black px-1.5 py-0.5 rounded shadow mt-1 block w-max mx-auto border border-emerald-800">
                  YOUR HOME
                </span>
              </div>

              {/* Moving Delivery Scooter Marker */}
              <motion.div
                animate={{ x: scooterPos.x, y: scooterPos.y }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
                className="absolute -top-3 -left-3 z-20 flex flex-col items-center cursor-default select-none"
              >
                <div className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  🛵
                </div>
                <span className="bg-red-500 text-white text-[7px] font-black px-1 py-0.2 rounded shadow mt-0.5 uppercase tracking-wider">
                  Rider
                </span>
              </motion.div>
            </div>
          </div>

          {/* Delivery Boy Contact Card (only if Preparing/Baking/Out for Delivery) */}
          {currentStatusIndex >= 1 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Delivery Valet</h3>
              
              <div className="flex items-center space-x-4">
                <img src={deliveryBoy.photo} alt={deliveryBoy.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-800 truncate">{deliveryBoy.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold truncate leading-snug">{deliveryBoy.vehicle}</p>
                  <div className="flex items-center mt-1 text-[10px] text-slate-500 font-bold space-x-1">
                    <span>★ {deliveryBoy.rating}</span>
                    <span className="text-slate-300">•</span>
                    <span>Diamond Valet</span>
                  </div>
                </div>
                
                {/* Dial Button */}
                <a
                  href={`tel:${deliveryBoy.phone}`}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl transition-all cursor-pointer flex items-center justify-center"
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
