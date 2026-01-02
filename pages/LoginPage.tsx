
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. (Note: Admin uses special creds from docs)');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glassmorphism p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center neon-border mx-auto mb-4">
            <span className="font-gaming font-bold text-2xl">L8</span>
          </div>
          <h2 className="text-2xl font-gaming font-bold">{APP_NAME}</h2>
          <p className="text-slate-400 mt-2 text-sm">Welcome back, Gamer!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. gamer@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <div className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg border border-white/5 mb-4">
            <p className="font-bold text-slate-400 mb-1 italic">Demo Credentials:</p>
            <p>Admin: admin@law8x1.com / Law8x1@123</p>
            <p>User: any email / 6+ char password</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-gaming font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Create One</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
