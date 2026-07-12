import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import { db } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function PizzaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedCrust, setSelectedCrust] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [livePrice, setLivePrice] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const availableToppings = [
    { name: 'Extra Cheese', price: 60.00 },
    { name: 'Pepperoni Slice', price: 50.00 },
    { name: 'Fresh Mushrooms', price: 40.00 },
    { name: 'Black Olives', price: 40.00 },
    { name: 'Spicy Jalapeños', price: 40.00 },
    { name: 'Sliced Onions', price: 30.00 }
  ];

  useEffect(() => {
    db.getProducts().then(allProducts => {
      const foundProduct = allProducts.find(p => p.id === id);
      if (!foundProduct) {
        // Redirect to 404 or menu
        navigate('/menu');
        return;
      }
      
      setProduct(foundProduct);
      
      // Set default selections
      const sizes = Object.keys(foundProduct.sizes);
      const crusts = Object.keys(foundProduct.crusts);
      setSelectedSize(sizes[0] || 'Regular');
      setSelectedCrust(crusts[0] || 'Standard');
      setQuantity(1);
      setSelectedToppings([]);

      // Related products (same category, excluding current)
      const related = allProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id);
      setRelatedProducts(related.slice(0, 4));
    }).catch(err => {
      console.error("Error loading products:", err);
      navigate('/menu');
    });
  }, [id, navigate]);

  // Recalculate price
  useEffect(() => {
    if (!product) return;
    const sizeExtra = product.sizes[selectedSize] || 0;
    const crustExtra = product.crusts[selectedCrust] || 0;
    const toppingsExtra = selectedToppings.reduce((sum, toppingName) => {
      const item = availableToppings.find(t => t.name === toppingName);
      return sum + (item ? item.price : 0);
    }, 0);
    
    const pricePerUnit = product.price + sizeExtra + crustExtra + toppingsExtra;
    setLivePrice(pricePerUnit * quantity);
  }, [product, selectedSize, selectedCrust, selectedToppings, quantity]);

  const handleToppingToggle = (toppingName) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter(t => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedCrust, selectedToppings, quantity);
    alert(`${product.name} added to cart!`);
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
    </div>
  );

  const isPizza = product.category === 'Veg' || product.category === 'Non Veg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back button */}
      <div>
        <Link to="/menu" className="inline-flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </Link>
      </div>

      {/* Main product configuration view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Left Side: Photo gallery card */}
        <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-h-[500px] object-cover hover:scale-102 transition-transform duration-500"
          />
        </div>

        {/* Right Side: Configuration tools */}
        <div className="space-y-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Header titles */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-red-500 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
              {product.popular && (
                <span className="text-xs font-black text-white uppercase tracking-wider bg-amber-500 px-2.5 py-1 rounded-lg">
                  Popular
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-500">
                <Star size={16} className="fill-amber-500" />
                <span className="text-sm font-bold text-slate-800 ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-400 text-xs font-medium">| {product.reviewsCount} reviews</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Size Selectors */}
          {Object.keys(product.sizes).length > 1 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Choose Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(product.sizes).map((size) => {
                  const extra = product.sizes[size];
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
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

          {/* Crust Selectors */}
          {isPizza && Object.keys(product.crusts).length > 1 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Choose Crust</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(product.crusts).map((crust) => {
                  const extra = product.crusts[crust];
                  const isSelected = selectedCrust === crust;
                  return (
                    <button
                      key={crust}
                      onClick={() => setSelectedCrust(crust)}
                      className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 text-red-600 font-bold ring-2 ring-red-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-sm block">{crust}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {extra > 0 ? `+₹${extra.toFixed(2)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toppings selection */}
          {isPizza && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Add Extra Toppings</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {availableToppings.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.name);
                  return (
                    <button
                      key={topping.name}
                      onClick={() => handleToppingToggle(topping.name)}
                      className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer h-20 ${
                        isSelected
                          ? 'border-red-500 bg-red-50/20 text-slate-800'
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-xs font-extrabold truncate pr-1">{topping.name}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                          isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check size={10} className="stroke-[3]" />}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">+₹{topping.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients list */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span key={ing} className="bg-slate-100 text-slate-600 text-xs px-3.5 py-1.5 rounded-full font-medium">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity and Cart Addition Row */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-6 justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 w-full sm:w-auto justify-between sm:justify-start shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-extrabold text-slate-800 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Total Price and button */}
            <div className="flex items-center space-x-6 w-full sm:w-auto justify-end sm:justify-start">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Grand Total</span>
                <span className="text-2xl font-black text-slate-900">₹{livePrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-extrabold text-sm transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8">
          <div className="text-left">
            <h2 className="text-2xl font-black tracking-tight text-slate-800">You Might Also Like</h2>
            <p className="text-xs text-slate-400 mt-1">Check out these delicious additions of {product.category}.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => navigate(`/pizza/${prod.id}`)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
