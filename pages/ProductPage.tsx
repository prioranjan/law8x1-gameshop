
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/dbService';
import { Product, Order } from '../types';
import { Icons } from '../constants';
import { useAuth } from '../context/AuthContext';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [gameId, setGameId] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (id) {
      db.getProductById(id).then(res => {
        if (res) setProduct(res);
      });
    }
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading game data...</div>;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!gameId || !paymentRef) {
      alert("Please fill all details!");
      return;
    }

    setLoading(true);
    try {
      await db.createOrder({
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        productId: product.id,
        productName: product.name,
        variantLabel: product.variants[selectedVariant].label,
        amount: product.variants[selectedVariant].price,
        gameId,
        paymentMethod: 'UPI',
        paymentReference: paymentRef
      });
      alert("Order placed successfully! Please wait for verification.");
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 glassmorphism p-2">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="glassmorphism p-4 rounded-xl border border-white/5">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Icons.ShoppingCart /> Secure Transaction
            </h4>
            <p className="text-xs text-slate-400">
              All top-ups are manually verified by our admins. Usually delivered within 15-30 minutes.
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">{product.category}</span>
          <h1 className="text-4xl font-gaming font-bold mb-4">{product.name}</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8">
            <label className="block text-sm font-bold mb-4 uppercase tracking-wider text-slate-300">Select Package</label>
            <div className="grid grid-cols-1 gap-3">
              {product.variants.map((v, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedVariant(idx)}
                  className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                    selectedVariant === idx 
                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                  }`}
                >
                  <span className="font-bold">{v.label}</span>
                  <span className="font-gaming text-blue-400">₹{v.price}</span>
                </button>
              ))}
            </div>
          </div>

          {!showCheckout && (
            <button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-gaming font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              PROCEED TO PAYMENT
            </button>
          )}
        </div>
      </div>

      {showCheckout && (
        <div className="glassmorphism p-8 rounded-2xl border border-blue-500/30 animate-scale-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-gaming">Payment Details</h2>
            <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl inline-block">
                {/* UPI MOCK QR */}
                <div className="w-40 h-40 bg-slate-200 flex items-center justify-center text-slate-800 font-bold text-center p-4">
                  Scan to Pay<br/>₹{product.variants[selectedVariant].price}<br/>law8x1@upi
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">UPI ID: <span className="text-blue-400">law8x1@ybl</span></p>
                <p className="text-xs text-slate-400">1. Open any UPI App (GPay, PhonePe, Paytm)<br/>2. Pay the exact amount<br/>3. Copy the 12-digit Ref No. / Transaction ID</p>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-slate-400">Player ID / Game ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 12345678"
                  value={gameId}
                  onChange={e => setGameId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-slate-400">Transaction Ref / ID (12 digits)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Paste your UPI Reference here"
                  value={paymentRef}
                  onChange={e => setPaymentRef(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-xl font-gaming font-bold transition-all"
              >
                {loading ? 'SUBMITTING...' : 'I HAVE PAID - SUBMIT ORDER'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
