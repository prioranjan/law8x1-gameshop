
import React, { useEffect, useState } from 'react';
import { db } from '../services/dbService';
import { Order, OrderStatus, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../constants';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const o = await db.getOrders();
    const p = await db.getProducts();
    setOrders(o);
    setProducts(p);
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    await db.updateOrderStatus(id, status);
    fetchData();
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'text-green-400';
      case OrderStatus.PENDING: return 'text-yellow-400';
      case OrderStatus.CANCELLED: return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-gaming font-bold">Admin Central</h1>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-700'}`}
          >
            Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'products' ? 'bg-blue-600 shadow-lg' : 'hover:bg-slate-700'}`}
          >
            Products ({products.length})
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="glassmorphism rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">User / Game ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Item</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Ref No</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-gaming text-xs text-blue-400">{order.id}</div>
                      <div className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.userName}</div>
                      <div className="text-xs text-yellow-500 font-mono">ID: {order.gameId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.productName}</div>
                      <div className="text-xs text-slate-400">{order.variantLabel}</div>
                    </td>
                    <td className="px-6 py-4 font-gaming">₹{order.amount}</td>
                    <td className="px-6 py-4">
                       <code className="text-xs bg-slate-800 px-2 py-1 rounded">{order.paymentReference}</code>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`bg-slate-900 border border-white/20 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-blue-500 font-bold ${getStatusClass(order.status)}`}
                      >
                        {Object.values(OrderStatus).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="p-12 text-center text-slate-400">No orders found yet.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Product Mock Button */}
          <div className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all min-h-[200px]">
            <span className="text-4xl mb-2">+</span>
            <span className="font-bold">Add New Product</span>
          </div>
          {products.map(p => (
            <div key={p.id} className="glassmorphism p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{p.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-gaming text-blue-400">₹{p.price}+</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Icons.Settings /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
