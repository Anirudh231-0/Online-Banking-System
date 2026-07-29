import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Landmark,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'accounts' as NavigationTab, label: 'Accounts & FDs', icon: CreditCard, badge: '4' },
    { id: 'analytics' as NavigationTab, label: 'Analytics & CIBIL', icon: BarChart3, badge: null },
    { id: 'security' as NavigationTab, label: 'Security & UPI', icon: ShieldCheck, badge: 'Safe' },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings, badge: null },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setIsOpenMobile(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-slate-900 text-slate-100 p-5">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Apex<span className="text-indigo-400 font-light">Bank India</span>
              </span>
              <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                Priority Banking
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="mt-6 space-y-1.5" aria-label="Main Navigation">
          <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Overview
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Safe'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-4 h-4 text-white/70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Pro Card */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-800/90 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Apex FD & Sweep Yield</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Earn up to <strong className="text-white font-semibold">7.25% p.a. interest</strong> on Fixed Deposits & Auto-Sweep Savings.
          </p>
          <button
            onClick={() => handleNavClick('accounts')}
            className="mt-3 w-full py-1.5 text-xs font-medium text-white bg-indigo-600/80 hover:bg-indigo-600 rounded-lg transition-colors border border-indigo-400/20 cursor-pointer"
          >
            Explore Accounts
          </button>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span>Log Out</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 group-hover:text-rose-300 px-2 py-0.5 rounded">
            v2.4 IST
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30 shadow-xl border-r border-slate-800">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
