import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function LoginPage() {
  const [email, setEmail] = useState('alex.mercer@stocksense.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xs shadow-md p-6 sm:p-8">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xs font-mono font-bold text-lg mb-2">
            SS
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">StockSense</h1>
          <p className="text-xs text-slate-500 mt-1">Inventory Management System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-slate-600 hover:text-slate-900 font-medium hover:underline"
              >
                Forgot password / OTP?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 focus:border-slate-800 outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Need a StockSense user account?{' '}
          <Link to="/signup" className="font-semibold text-slate-900 hover:underline">
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
}
