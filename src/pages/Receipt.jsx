import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Receipt() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState({
    restaurantName: 'PizzaHub',
    phone: '+91 98765 43210',
    email: 'hello@pizzahub.com',
    address: '42 Gourmet Boulevard, New Delhi 110001',
    gstRate: 18
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order directly from the API
    db.getOrders()
      .then(res => {
        const found = res.find(o => o.id === orderId);
        if (found) setOrder(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading order:", err);
        setLoading(false);
      });

    // Fetch settings directly from the API
    db.getSettings()
      .then(res => {
        if (res && res.restaurantName) setSettings(res);
      })
      .catch(err => console.error(err));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">Loading Invoice...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6 text-center space-y-4">
        <h2 className="text-base font-black text-slate-800">Invoice Not Found</h2>
        <p className="text-xs text-slate-500 max-w-xs">We couldn't locate any order with the receipt ID: <span className="font-mono text-red-500 font-bold">{orderId}</span></p>
        <Link to="/" className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-xs shadow-md">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 font-sans print:bg-white print:py-0">
      
      {/* Receipts Control Header Bar (Hidden during printing) */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 print:hidden">
        <Link to="/" className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-700 text-xs font-bold transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Store</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
        >
          <Printer size={13} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Main Premium Invoice layout */}
      <div className="w-full max-w-2xl bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* Invoice Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🍕</span>
              <h1 className="text-lg font-black text-slate-805 tracking-tight uppercase">{settings.restaurantName}</h1>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 max-w-xs">{settings.address}</p>
            <p className="text-[9px] text-slate-400 font-mono">GSTIN: 07AAAAA1111A1Z1</p>
          </div>
          <div className="text-left sm:text-right space-y-1">
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold text-[9px] uppercase inline-flex items-center gap-1.5">
              <ShieldCheck size={11} className="stroke-[2.5]" />
              <span>Paid Receipt</span>
            </span>
            <h2 className="text-xl font-black text-slate-800 mt-2">INVOICE</h2>
            <p className="text-[10px] text-slate-400 font-mono">ID: <span className="text-slate-700 font-bold">{order.id}</span></p>
          </div>
        </div>

        {/* Invoice Bill Metadata Info */}
        <div className="grid grid-cols-2 gap-8 py-6 text-xs border-b border-slate-100">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">Billed To</h3>
            <div>
              <p className="font-bold text-slate-800">{order.customerName}</p>
              <p className="text-slate-500 font-medium mt-0.5">{order.phone || 'N/A'}</p>
              <p className="text-slate-500 font-medium leading-relaxed mt-1 max-w-[200px]">{order.address}</p>
            </div>
          </div>
          <div className="space-y-2 sm:text-right">
            <h3 className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider">Invoice Details</h3>
            <div className="space-y-1">
              <p className="text-slate-500 font-medium">Date: <span className="text-slate-700 font-bold">{new Date(order.date).toLocaleString()}</span></p>
              <p className="text-slate-500 font-medium">Payment Mode: <span className="text-slate-700 font-bold uppercase">{order.paymentMethod}</span></p>
              <p className="text-slate-500 font-medium">Payment Status: <span className="text-emerald-600 font-bold uppercase">{order.paymentStatus}</span></p>
            </div>
          </div>
        </div>

        {/* Tabular Itemized List */}
        <div className="py-6 border-b border-slate-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
                <th className="pb-3 pr-4">Item Description</th>
                <th className="pb-3 px-4 text-center">Qty</th>
                <th className="pb-3 px-4 text-right">Unit Price</th>
                <th className="pb-3 pl-4 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {order.items.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-3 pr-4">
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                      Size: {item.size} | Crust: {item.crust}
                    </span>
                    {item.toppings && item.toppings.length > 0 && (
                      <span className="text-[9px] text-slate-400 font-medium block mt-1">
                        + {item.toppings.join(', ')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-600">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 pl-4 text-right font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Ledger breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start pt-6 gap-6">
          <div className="text-[10px] text-slate-400 space-y-1 max-w-[280px]">
            <p className="font-bold uppercase tracking-wider">Terms & Conditions</p>
            <p className="leading-relaxed">This receipt is a computerized summary of your billing transaction. For any corrections or updates, please contact Hello@pizzahub.com.</p>
          </div>

          <div className="w-full sm:w-64 space-y-2.5 text-xs font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800 font-bold">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST ({settings.gstRate}%)</span>
              <span className="text-slate-800 font-bold">₹{order.gst.toFixed(2)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-slate-800 font-bold">₹{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-3">
              <span className="text-slate-900">Total Invoice Amount</span>
              <span className="text-slate-950 font-black text-base">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Greeting */}
        <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 mt-10 pt-6">
          <p className="font-bold">Thank you for dining with us! We hope to see you again soon. 🍕</p>
          <p className="text-[9px] mt-1">Generated by PizzaHub POS Counter.</p>
        </div>

      </div>

    </div>
  );
}
