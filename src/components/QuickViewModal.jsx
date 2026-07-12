import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  
  if (!product) return null;

  // Configuration defaults
  const sizeOptions = Object.keys(product.sizes);
  const crustOptions = Object.keys(product.crusts);
  
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || 'Regular');
  const [selectedCrust, setSelectedCrust] = useState(crustOptions[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [livePrice, setLivePrice] = useState(product.price);

  const availableToppings = [
    { name: 'Extra Cheese', price: 2.00 },
    { name: 'Pepperoni Slice', price: 1.50 },
    { name: 'Fresh Mushrooms', price: 1.00 },
    { name: 'Black Olives', price: 1.00 },
    { name: 'Spicy Jalapeños', price: 1.00 },
    { name: 'Sliced Onions', price: 0.75 }
  ];

  // Calculate live price based on selections
  useEffect(() => {
    const sizePriceOffset = product.sizes[selectedSize] || 0;
    const crustPriceOffset = product.crusts[selectedCrust] || 0;
    
    // Add extra toppings prices
    const toppingsPrice = selectedToppings.reduce((sum, toppingName) => {
      const item = availableToppings.find(t => t.name === toppingName);
      return sum + (item ? item.price : 0);
    }, 0);

    const pricePerUnit = product.price + sizePriceOffset + crustPriceOffset + toppingsPrice;
    setLivePrice(pricePerUnit * quantity);
  }, [selectedSize, selectedCrust, selectedToppings, quantity, product]);

  const handleToppingToggle = (toppingName) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter(t => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedCrust, selectedToppings, quantity);
    onClose();
  };

  const isPizza = product.category === 'Veg' || product.category === 'Non Veg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90svh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Left Column: Product Info & Preview */}
        <div className="relative bg-slate-50 flex flex-col justify-center min-h-[300px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover max-h-[350px] md:max-h-none md:absolute md:inset-0"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none hidden md:block" />
        </div>

        {/* Right Column: Options & Controls */}
        <div className="p-6 md:p-8 flex flex-col overflow-y-auto max-h-[calc(90svh-100px)] md:max-h-[90svh]">
          {/* Brand/Category & Title */}
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
              {product.category}
            </span>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              {product.name}
            </h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selectors (only for Pizzas or products with multi-sizes) */}
          {sizeOptions.length > 1 && (
            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Choose Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((size) => {
                  const extra = product.sizes[size];
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 text-red-600 font-bold ring-2 ring-red-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-sm block">{size}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {extra > 0 ? `+₹${extra.toFixed(2)}` : 'Base Price'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crust Selectors (only for Pizzas) */}
          {isPizza && crustOptions.length > 1 && (
            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Choose Crust</h3>
              <div className="grid grid-cols-3 gap-3">
                {crustOptions.map((crust) => {
                  const extra = product.crusts[crust];
                  const isSelected = selectedCrust === crust;
                  return (
                    <button
                      key={crust}
                      onClick={() => setSelectedCrust(crust)}
                      className={`py-3 px-1 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 text-red-600 font-bold ring-2 ring-red-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-xs block font-semibold truncate px-1">{crust}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {extra > 0 ? `+₹${extra.toFixed(2)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra Toppings (only for Pizzas) */}
          {isPizza && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Add Extra Toppings</h3>
                <span className="text-[10px] text-slate-400 font-medium">*+₹40 per topping</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableToppings.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.name);
                  return (
                    <button
                      key={topping.name}
                      onClick={() => handleToppingToggle(topping.name)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-50/20 text-slate-800'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="text-xs font-medium truncate pr-1">{topping.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-bold text-slate-400">+₹{topping.price.toFixed(2)}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check size={10} className="stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients list */}
          <div className="mt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing) => (
                <span key={ing} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Actions Area */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center bg-slate-100 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-extrabold text-slate-800 w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Total Price & Add to Cart button */}
            <div className="flex items-center space-x-4 pl-4">
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Price</span>
                <span className="text-xl font-black text-slate-900">₹{livePrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center space-x-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/35"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
