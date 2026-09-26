import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Mail, KeyRound, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authApi.requestOtp(email);
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authApi.resetPassword(email, otp, newPassword);
      setMessage(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xs shadow-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-xs font-mono font-bold text-lg mb-2">
            SS
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">
            {step === 1 ? 'Password Reset via OTP' : 'Verify OTP & Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1
              ? 'Enter your registered email address to receive an OTP'
              : 'Enter the verification code and set your new password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xs flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.mercer@stocksense.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? 'Sending Verification Code...' : 'Send OTP Verification Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP code"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 font-mono tracking-widest outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xs focus:ring-1 focus:ring-slate-800 outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Change email address
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
