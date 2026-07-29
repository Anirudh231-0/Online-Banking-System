import React from 'react';
import { Send, Receipt, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { ModalType } from '../types';

interface QuickActionsProps {
  onOpenModal: (type: ModalType) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenModal }) => {
  const actions = [
    {
      id: 'send' as ModalType,
      title: 'UPI / Send Money',
      subtitle: 'Instant via UPI ID or Mobile',
      icon: Send,
      badgeColor: 'bg-indigo-100 text-indigo-700',
      hoverBorder: 'hover:border-indigo-300',
    },
    {
      id: 'pay' as ModalType,
      title: 'UPI Bill Pay',
      subtitle: 'Electricity, DTH & FASTag',
      icon: Receipt,
      badgeColor: 'bg-emerald-100 text-emerald-700',
      hoverBorder: 'hover:border-emerald-300',
    },
    {
      id: 'transfer' as ModalType,
      title: 'Self Transfer',
      subtitle: 'NEFT / IMPS to Own Accounts',
      icon: ArrowLeftRight,
      badgeColor: 'bg-blue-100 text-blue-700',
      hoverBorder: 'hover:border-blue-300',
    },
    {
      id: 'exchange' as ModalType,
      title: 'Forex Convert',
      subtitle: 'INR to USD, EUR, AED',
      icon: RefreshCw,
      badgeColor: 'bg-purple-100 text-purple-700',
      hoverBorder: 'hover:border-purple-300',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Quick Banking Actions</h3>
          <p className="text-xs text-slate-500">Perform instant UPI and banking transfers</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onOpenModal(action.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/80 active:bg-indigo-100/80 transition-all duration-200 group text-center cursor-pointer ${action.hoverBorder} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            >
              <div className={`w-11 h-11 rounded-xl ${action.badgeColor} flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110 shadow-xs`}>
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:rotate-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                {action.title}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 group-hover:text-indigo-600/80 transition-colors hidden sm:block">
                {action.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
