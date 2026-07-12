import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, Star } from 'lucide-react';
import { db } from '../services/db';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category state (loaded from searchParams or default to All)
  const activeCategory = searchParams.get('category') || 'All';
  
  // Sub-filter: Veg Only, Non-Veg Only, or All
  const [dietFilter, setDietFilter] = useState('All'); // 'All' | 'Veg' | 'NonVeg'

  // Sort state
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'priceAsc' | 'priceDesc' | 'rating'

  // Modal triggers
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [categories, setCategories] = useState(['All']);

  // Load products and categories on mount
  useEffect(() => {
    db.getProducts().then(res => setProducts(res)).catch(e => console.error(e));
    db.getCategories().then(res => setCategories(['All', ...res])).catch(e => console.error(e));
  }, []);

  // Filter and sort items
  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Diet Toggle (only relevant for Pizza or Food categories)
    if (dietFilter === 'Veg') {
      result = result.filter(p => p.category === 'Veg' || p.category === 'Desserts' || p.category === 'Drinks' || p.category === 'Garlic Bread');
    } else if (dietFilter === 'NonVeg') {
      result = result.filter(p => p.category === 'Non Veg');
    }

    // Sorting logic
    if (sortBy === 'popularity') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, activeCategory, searchQuery, dietFilter, sortBy]);

  const handleCategoryChange = (catName) => {
    if (catName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen">
      
      {/* Banner / Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">Our Signature Menu</h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
          Fresh ingredients, artisanal sourdough, and love baked into every single bite.
        </p>
      </div>

      {/* Filter Toolbar Controls */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search pizzas, sides, desserts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-all duration-300"
            />
          </div>

          {/* Diet Filters (Veg / Non-veg) */}
          <div className="flex bg-slate-50 border border-slate-100/50 p-1.5 rounded-2xl items-center justify-between w-full">
            <button
              onClick={() => setDietFilter('All')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                dietFilter === 'All' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Food
            </button>
            <button
              onClick={() => setDietFilter('Veg')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                dietFilter === 'Veg' ? 'bg-white shadow text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietFilter('NonVeg')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                dietFilter === 'NonVeg' ? 'bg-white shadow text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3 w-full justify-end">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-red-500 cursor-pointer min-w-[150px] lg:w-auto"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

        </div>

        {/* Categories Badges */}
        <div className="border-t border-slate-50 pt-4 flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`py-2 px-5 text-xs font-extrabold rounded-full transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Products Listing Grid */}
      <div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white border border-slate-100 rounded-3xl"
          >
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-extrabold text-slate-800">No items found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your filters. Try search terms or resetting categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietFilter('All');
                setSearchParams({});
              }}
              className="mt-6 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-red-500 rounded-xl transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Render Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
