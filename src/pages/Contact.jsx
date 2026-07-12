import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    // Simulate sending message
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 min-h-[75vh]">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-lg inline-block">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">We'd Love to Hear From You</h1>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Have feedback on our crusts, planning a party, or need bulk order setups? Message us!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Contact details & Map */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Details Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Contact Details</h3>
            
            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="flex items-start space-x-3.5">
                <MapPin className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-800 font-extrabold block">Main Restaurant Location</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    42 Gourmet Boulevard, Culinary District, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Phone className="text-red-500 w-5 h-5 shrink-0" />
                <div>
                  <span className="text-slate-800 font-extrabold block">Call Baking Station</span>
                  <a href="tel:+15553459876" className="text-slate-400 hover:text-red-500 transition-colors mt-1 block">
                    +1 (555) 345-9876
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <Mail className="text-red-500 w-5 h-5 shrink-0" />
                <div>
                  <span className="text-slate-800 font-extrabold block">Email Inquiries</span>
                  <a href="mailto:hello@pizzaking.com" className="text-slate-400 hover:text-red-500 transition-colors mt-1 block">
                    hello@pizzaking.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Map Coverage Pin Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Find us here</span>
            
            <div className="w-full h-44 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* SVG Map mockup */}
              <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="contactGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#contactGrid)" />
                <path d="M-20 40 L500 40 M-20 120 L500 120 M150 -20 L150 250" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="80" r="14" fill="#fee2e2" />
                <circle cx="280" cy="50" r="22" fill="#d1fae5" />
              </svg>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <MapPin size={14} className="stroke-[3]" />
                </div>
                <span className="bg-slate-900/90 text-white text-[8px] font-black px-2 py-0.5 rounded shadow mt-1">
                  PIZZAKING HQ
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Contact Form */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-50 pb-3">Send a Message</h3>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.name.message}</span>}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.email.message}</span>}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Subject</label>
                  <input
                    type="text"
                    {...register('subject', { required: 'Subject is required' })}
                    placeholder="e.g. Bulk order planning"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  {errors.subject && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.subject.message}</span>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Message Body</label>
                  <textarea
                    rows="5"
                    {...register('message', { required: 'Message is required' })}
                    placeholder="Write details..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white resize-none"
                  />
                  {errors.message && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.message.message}</span>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow shadow-red-500/10 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Submit Form</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="submitted-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow shadow-emerald-500/20">
                  <MessageSquareCheck size={22} />
                </div>
                <h4 className="font-extrabold text-slate-800 text-base">Message Submitted!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Thank you for writing. Our customer happiness managers will review your message and respond within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
