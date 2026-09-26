import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, KeyRound, Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 border border-slate-200 rounded-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-14 h-14 bg-slate-900 text-white font-bold font-mono text-xl rounded-xs flex items-center justify-center">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.role || 'Inventory Staff'}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            User Credentials & Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
              <span className="text-slate-500 font-medium block mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </span>
              <span className="font-bold text-slate-900 text-sm">{user?.name}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
              <span className="text-slate-500 font-medium block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Work Email
              </span>
              <span className="font-bold text-slate-900 text-sm">{user?.email}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
              <span className="text-slate-500 font-medium block mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> Assigned Role
              </span>
              <span className="font-bold text-slate-900 text-sm">{user?.role || 'Inventory Manager'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
              <span className="text-slate-500 font-medium block mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Member Since
              </span>
              <span className="font-mono text-slate-800 font-bold text-sm">September 2026</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button variant="danger" size="md" onClick={logout}>
            Logout of Session
          </Button>
        </div>
      </div>
    </div>
  );
}
