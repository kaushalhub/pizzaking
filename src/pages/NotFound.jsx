import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6"
      >
        <div className="text-6xl select-none">🍽️</div>
        <div className="space-y-2">
          <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider">
            Error 404
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Plate is Empty!</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            The page you are looking for has either been moved, devoured, or never existed in the first place.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-5 py-3 bg-slate-900 hover:bg-red-500 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Compass size={14} />
            <span>Go Back Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
