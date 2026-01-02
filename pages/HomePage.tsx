
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/dbService';
import { Product } from '../types';
import { Icons } from '../constants';
import { getGameAdvice } from '../services/geminiService';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    db.getProducts().then(setProducts);
  }, []);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion) return;
    setAiLoading(true);
    const answer = await getGameAdvice(aiQuestion);
    setAiAnswer(answer || '');
    setAiLoading(false);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 md:p-16 border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-gaming font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            LEVEL UP YOUR GAMING
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-lg">
            Instant diamonds, UC, and gaming credits at the best prices. Secure payments and manual verification to ensure 100% safety.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#products" className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 neon-border">
              Shop Now
            </a>
            <div className="flex items-center gap-2 text-sm text-green-400 font-semibold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
              <Icons.CheckCircle /> 24/7 Fast Delivery
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full"></div>
        <div className="absolute left-[-5%] bottom-[-5%] w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full"></div>
      </section>

      {/* AI Assistant Card */}
      <section className="glassmorphism p-6 rounded-2xl border-l-4 border-l-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600/20 p-2 rounded-lg">
             <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-gaming text-lg">Gaming AI Assistant</h3>
            <p className="text-sm text-slate-400">Ask about best packages or game tips</p>
          </div>
        </div>
        <form onSubmit={handleAiAsk} className="flex gap-2">
          <input 
            type="text" 
            placeholder="What should I buy for Free Fire?" 
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="flex-grow bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={aiLoading}
            className="bg-blue-600 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            {aiLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        {aiAnswer && (
          <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-blue-500/20 text-slate-300 leading-relaxed text-sm animate-fade-in">
            {aiAnswer}
          </div>
        )}
      </section>

      {/* Product List */}
      <section id="products" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-gaming flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Trending Top-Ups
          </h2>
          <div className="flex gap-2">
             <button className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700"><Icons.Package/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="group glassmorphism rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-blue-500/30"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{product.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Icons.Star key={i}/>)}
                  <span className="text-xs text-slate-400 ml-2">(4.9/5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400 font-gaming">₹{product.price}</span>
                  <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Buy Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
