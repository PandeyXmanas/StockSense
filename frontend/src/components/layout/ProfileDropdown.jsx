import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xs hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
      >
        <div className="w-7 h-7 bg-slate-800 text-white rounded-xs flex items-center justify-center font-bold text-xs uppercase">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[10px] text-slate-500 font-medium leading-tight">{user?.role || 'Staff'}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xs shadow-md z-50 py-1 divide-y divide-slate-100 text-xs">
          <div className="px-3 py-2 bg-slate-50/70">
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded-xs">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {user?.role || 'User'}
            </span>
          </div>
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              My Profile
            </button>
          </div>
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
