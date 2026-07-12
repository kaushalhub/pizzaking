import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [settings, setSettings] = useState({
    gstRate: 18,
    deliveryCharge: 3.99,
    minFreeDelivery: 30.00
  });

  // Load cart and settings from API on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ph_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    db.getSettings()
      .then(savedSettings => {
        if (savedSettings) {
          setSettings(savedSettings);
        }
      })
      .catch(err => console.error("Error loading settings:", err));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("ph_cart", JSON.stringify(newCart));
  };

  const generateCartItemId = (productId, size, crust, toppings) => {
    const toppingsStr = [...toppings].sort().join(',');
    return `${productId}-${size}-${crust}-${toppingsStr}`;
  };

  const addToCart = (product, size, crust, toppings = [], quantity = 1) => {
    const cartItemId = generateCartItemId(product.id, size, crust, toppings);
    
    // Calculate customization price
    const sizeExtra = product.sizes[size] || 0;
    const crustExtra = product.crusts[crust] || 0;
    
    // Extra toppings price (₹40 per extra topping as a standard)
    const toppingsExtra = toppings.length * 40.00;
    
    const customizedPrice = product.price + sizeExtra + crustExtra + toppingsExtra;
    
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    let newCart = [...cart];
    if (existingIndex !== -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        cartItemId,
        product,
        name: product.name,
        image: product.image,
        size,
        crust,
        toppings,
        quantity,
        customizedPrice,
        category: product.category
      });
    }
    saveCart(newCart);
  };

  const removeFromCart = (cartItemId) => {
    const newCart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart(newCart);
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const newCart = cart.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const applyCoupon = async (code) => {
    try {
      const coupons = await db.getCoupons();
      const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
      if (!coupon) return { success: false, message: "Invalid or inactive coupon code" };
      
      const sub = getSubtotal();
      if (sub < coupon.minOrder) {
        return { success: false, message: `Minimum order of ₹${coupon.minOrder.toFixed(2)} required for this coupon.` };
      }
      
      setAppliedCoupon(coupon);
      return { success: true, message: "Coupon applied successfully!" };
    } catch (err) {
      return { success: false, message: "Failed to validate coupon on the server." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedCoupon(null);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.customizedPrice * item.quantity), 0);
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    const sub = getSubtotal();
    if (appliedCoupon.type === 'percentage') {
      return sub * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, sub);
    }
    return 0;
  };

  const getDeliveryFee = () => {
    const sub = getSubtotal();
    if (sub === 0) return 0;
    if (appliedCoupon && appliedCoupon.type === 'free_shipping') return 0;
    if (sub >= settings.minFreeDelivery) return 0;
    return settings.deliveryCharge;
  };

  const getGST = () => {
    const sub = getSubtotal();
    const discount = getDiscount();
    const taxableAmount = Math.max(0, sub - discount);
    return taxableAmount * (settings.gstRate / 100);
  };

  const getGrandTotal = () => {
    const sub = getSubtotal();
    const discount = getDiscount();
    const gst = getGST();
    const delivery = getDeliveryFee();
    return Math.max(0, sub - discount + gst + delivery);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      clearCart,
      getSubtotal,
      getDiscount,
      getDeliveryFee,
      getGST,
      getGrandTotal,
      settings
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
