import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const loadData = () => {
    db.getOrders()
      .then(res => setOrders(res))
      .catch(e => console.error("Error loading orders:", e));
  };

  useEffect(() => {
    loadData();

    // Listen to background order update dispatch events
    const handleOrdersUpdated = () => {
      loadData();
    };
    window.addEventListener("ph_orders_updated", handleOrdersUpdated);

    // Simulate order progress in background
    const interval = setInterval(async () => {
      try {
        const currentOrders = await db.getOrders();
        const statusFlow = ["Received", "Preparing", "Baking", "Out for Delivery", "Delivered"];
        let updated = false;

        for (const order of currentOrders) {
          if (order.status !== "Delivered") {
            const currentIndex = statusFlow.indexOf(order.status);
            if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
              const nextStatus = statusFlow[currentIndex + 1];
              await db.updateOrderStatus(order.id, nextStatus);
              updated = true;
            }
          }
        }

        if (updated) {
          loadData();
          window.dispatchEvent(new Event("ph_orders_updated"));
        }
      } catch (err) {
        console.error("Order status background simulation failed:", err);
      }
    }, 30000); // Advance status every 30 seconds

    return () => {
      clearInterval(interval);
      window.removeEventListener("ph_orders_updated", handleOrdersUpdated);
    };
  }, []);

  const placeOrder = async (customerDetails, paymentMethod) => {
    const newOrder = await db.addOrder({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      items: customerDetails.items,
      subtotal: customerDetails.subtotal,
      gst: customerDetails.gst,
      deliveryFee: customerDetails.deliveryFee,
      discount: customerDetails.discount,
      total: customerDetails.total,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Paid"
    });

    loadData();
    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find(o => o.id === id);
  };

  const getMyOrders = (email) => {
    if (!email) return [];
    return orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrderById, getMyOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
