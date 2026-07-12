import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { User, MapPin, ClipboardList, LogOut, Plus, Trash2, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, addAddress, removeAddress, logout } = useAuth();
  const { getMyOrders, orders } = useOrders();

  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'addresses' | 'orders'
  const [myOrders, setMyOrders] = useState([]);
  
  // Custom Address input state
  const [newAddressInput, setNewAddressInput] = useState('');
  const [addressError, setAddressError] = useState('');

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user values in form
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('phone', user.phone || '');

    // Fetch order history
    setMyOrders(getMyOrders(user.email));
  }, [user, navigate, setValue, orders]);

  if (!user) return null;

  const handleInfoSubmit = (data) => {
    updateProfile({
      name: data.name,
      email: data.email,
      phone: data.phone
    });
    alert("Profile information updated successfully!");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddressError('');
    if (!newAddressInput.trim()) {
      setAddressError('Address field cannot be empty');
      return;
    }
    addAddress(newAddressInput.trim());
    setNewAddressInput('');
  };

  const tabs = [
    { id: 'info', label: 'Personal Information', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'orders', label: 'Order History', icon: ClipboardList }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Title */}
      <div className="text-left mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your personal settings, addresses, and order histories.</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section: Tab Content Panels */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Personal Info form */}
            {activeTab === 'info' && (
              <motion.div
                key="info-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Personal Details</h3>
                <form onSubmit={handleSubmit(handleInfoSubmit)} className="space-y-4">
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
                        disabled
                        {...register('email')}
                        className="w-full bg-slate-100 border border-slate-100 text-slate-400 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      {...register('phone', { required: 'Phone is required' })}
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.phone.message}</span>}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Tab 2: Addresses Panel */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Saved Addresses</h3>
                
                {/* List of Saved Addresses */}
                {user.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {user.addresses.map((address, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                      >
                        <div className="flex items-start space-x-3">
                          <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-slate-600 leading-relaxed">{address}</span>
                        </div>
                        <button
                          onClick={() => removeAddress(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic">No saved addresses found. Add one below.</p>
                )}

                {/* Add New Address Form */}
                <form onSubmit={handleAddAddress} className="pt-4 border-t border-slate-50 space-y-3">
                  <label className="text-xs font-bold text-slate-400 block">Add New Delivery Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 789 Broadway Ave, New York, NY 10003"
                      value={newAddressInput}
                      onChange={(e) => setNewAddressInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 bg-slate-900 hover:bg-red-500 text-white rounded-xl font-extrabold text-xs transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                  {addressError && <span className="text-[10px] text-red-500 font-bold">{addressError}</span>}
                </form>
              </motion.div>
            )}

            {/* Tab 3: Order History Panel */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">My Past Orders</h3>
                
                {myOrders.length > 0 ? (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-extrabold text-slate-800">{order.id}</span>
                            <span className="text-slate-300 text-xs">•</span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Items summary */}
                          <p className="text-xs text-slate-500 font-medium leading-relaxed truncate max-w-sm">
                            {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                          </p>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-slate-700">₹{order.total.toFixed(2)}</span>
                            <span className="text-slate-300 text-xs">•</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-600'
                                : order.status === 'Received'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Link to Track Order */}
                        <button
                          onClick={() => navigate(`/track-order/${order.id}`)}
                          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-red-500 rounded-xl border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <span>Track / Details</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold mt-2.5">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => navigate('/menu')}
                      className="mt-4 px-4 py-2 bg-slate-900 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Shop Online Now
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
