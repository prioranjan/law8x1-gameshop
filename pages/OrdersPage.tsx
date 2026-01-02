
import React, { useEffect, useState } from 'react';
import { db } from '../services/dbService';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../constants';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      db.getUserOrders(user.uid).then(res => {
        setOrders(res);
        setLoading(false);
      });
    }
  }, [user]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'text-green-400 bg-green-400/10 border-green-400/20';
      case OrderStatus.PENDING: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case OrderStatus.CANCELLED: return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your orders...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-gaming font-bold mb-8 flex items-center gap-3">
        <Icons.ShoppingCart /> My Purchase History
      </h1>

      {orders.length === 0 ? (
        <div className="glassmorphism p-12 text-center rounded-2xl border border-white/5">
          <p className="text-slate-400 mb-6">You haven't made any purchases yet.</p>
          <a href="/" className="inline-block bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">Start Shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="glassmorphism p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-gaming text-slate-500 uppercase tracking-widest">{order.id}</span>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                   </span>
                </div>
                <h3 className="text-xl font-bold">{order.productName}</h3>
                <p className="text-sm text-slate-400">{order.variantLabel} • ID: <span className="text-blue-400">{order.gameId}</span></p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <span className="text-2xl font-gaming font-bold text-white">₹{order.amount}</span>
                <span className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
