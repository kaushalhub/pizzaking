import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  const isVeg = product.category === 'Veg' || product.category === 'Desserts' || product.category === 'Drinks' || product.category === 'Garlic Bread';

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // Default config: first size and crust options
    const defaultSize = Object.keys(product.sizes)[0] || 'Regular';
    const defaultCrust = Object.keys(product.crusts)[0] || 'Standard';
    addToCart(product, defaultSize, defaultCrust, [], 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200/60 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative pt-[70%] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Category Indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider">
          <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-slate-700">{product.category}</span>
        </div>

        {/* Popular Tag */}
        {product.popular && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
            Popular
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.reviewsCount})</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="text-base font-extrabold text-slate-800 hover:text-red-500 cursor-pointer transition-colors line-clamp-1 mb-1"
        >
          {product.name}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Footer info (Price + actions) */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Starts at</span>
            <span className="text-lg font-black text-slate-900">₹{product.price.toFixed(2)}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onQuickView(product)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer flex items-center justify-center"
              title="Quick View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm shadow-red-500/10 hover:shadow-red-500/25"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
