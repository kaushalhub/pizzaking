import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Clock, Award, ShieldCheck, Star } from 'lucide-react';
import { db } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    db.getBanners().then(res => setBanners(res)).catch(e => console.error(e));
    db.getProducts().then(allProducts => {
      setFeaturedProducts(allProducts.filter(p => p.featured));
      setPopularProducts(allProducts.filter(p => p.popular));
    }).catch(e => console.error(e));
    db.getCoupons().then(allCoupons => {
      setCoupons(allCoupons.filter(c => c.active));
    }).catch(e => console.error(e));
  }, []);

  // Banner carousel auto rotate
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  const categories = [
    { name: 'Veg', icon: '🌱', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50' },
    { name: 'Non Veg', icon: '🍗', bg: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100/50' },
    { name: 'Garlic Bread', icon: '🥖', bg: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50' },
    { name: 'Desserts', icon: '🍰', bg: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100/50' },
    { name: 'Drinks', icon: '🥤', bg: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50' }
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "Regular Customer",
      comment: "The crust is incredibly light and crispy. It is close to authentic Neapolitan pizza. PizzaKing is my absolute favorite!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Sophia Carter",
      role: "Food Blogger",
      comment: "Unmatched speed! The pizza arrived piping hot within 25 minutes, and the Cheese Burst option was super creamy and rich.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Carousel */}
      <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          {banners.length > 0 && (
            <motion.div
              key={activeBannerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image */}
              <img
                src={banners[activeBannerIndex].image}
                alt={banners[activeBannerIndex].title}
                className="w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
              
              {/* Banner Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl text-left space-y-6">
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center space-x-1 bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      <Flame size={12} />
                      <span>Hot & Fresh</span>
                    </motion.span>

                    <motion.h1
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight"
                    >
                      {banners[activeBannerIndex].title}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-300 text-sm sm:text-lg max-w-lg leading-relaxed font-medium"
                    >
                      {banners[activeBannerIndex].subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-4"
                    >
                      <Link
                        to={banners[activeBannerIndex].link}
                        className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-2xl bg-red-500 text-white font-extrabold hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
                      >
                        <span>{banners[activeBannerIndex].buttonText}</span>
                        <ArrowRight size={18} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeBannerIndex === idx ? 'bg-red-500 w-8' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Icons Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Browse Categories</h2>
          <p className="text-sm text-slate-500 mt-2">Explore our delicious selection crafted with love.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/menu?category=${cat.name}`)}
              className={`p-6 rounded-3xl border border-slate-100 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:scale-102 flex flex-col items-center space-y-3 ${cat.bg}`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <span className="font-extrabold text-sm tracking-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Active Coupons / Offers Section */}
      {coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Deals & Offers</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Apply promo codes at checkout for heavy savings.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="relative bg-gradient-to-br from-red-500 to-amber-500 text-white rounded-3xl p-6 shadow-md overflow-hidden flex flex-col justify-between h-40 border border-red-400/20"
              >
                {/* Decorative background circles */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />
                
                <div>
                  <span className="bg-white/20 text-white border border-white/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                    PROMO CODE
                  </span>
                  <h3 className="text-xl font-black tracking-tight mt-3">{coupon.code}</h3>
                  <p className="text-xs text-white/90 font-medium mt-1 leading-snug">{coupon.description}</p>
                </div>
                
                <div className="flex justify-between items-center text-xs mt-auto font-bold text-white/90">
                  <span>Min. Order: ${coupon.minOrder.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      alert(`Coupon code "${coupon.code}" copied to clipboard!`);
                    }}
                    className="bg-white text-red-600 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Pizza Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Featured Creations</h2>
            <p className="text-sm text-slate-500 mt-2">Handpicked chef-special sourdough masterpieces you must try.</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-red-500 hover:text-red-600 transition-all shrink-0 hover:underline"
          >
            <span>View Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Popular Items section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-800">Popular Slices</h2>
            <p className="text-sm text-slate-500 mt-2">The crowd favorites and highest-rated pizzas this week.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Infographics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Why PizzaKing?</h2>
          <p className="text-sm text-slate-500 mt-2">We maintain the highest standards of culinary quality.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center space-y-4 p-6 bg-white rounded-3xl border border-slate-100/60 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              🍕
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Stone-Baked Oven</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Baked at 400°C in Neapolitan stone ovens for a crispy crust and perfectly charred edge.
            </p>
          </div>
          <div className="text-center space-y-4 p-6 bg-white rounded-3xl border border-slate-100/60 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">30 Min Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Piping hot pizza delivered right to your door step. Free if we exceed our delivery promise.
            </p>
          </div>
          <div className="text-center space-y-4 p-6 bg-white rounded-3xl border border-slate-100/60 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">100% Sourdough</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We slow-ferment our signature pizza dough for 48 hours for lighter digestibility and crispiness.
            </p>
          </div>
          <div className="text-center space-y-4 p-6 bg-white rounded-3xl border border-slate-100/60 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Gourmet Ingredients</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Imported Italian tomato sauce, locally-sourced fresh mozzarella cheese, and seasonal toppings.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black tracking-tight text-white">What Our Customers Say</h2>
            <p className="text-sm text-slate-400 mt-2">Read honest reviews from our community of pizza lovers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-8 rounded-3xl space-y-6 relative">
                {/* Quote symbol mark */}
                <div className="absolute top-6 right-8 text-6xl text-slate-800 font-serif leading-none select-none">“</div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
                <div className="flex items-center space-x-3.5 pt-2">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-slate-800" />
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{t.name}</h4>
                    <span className="text-xs text-slate-500 font-semibold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
