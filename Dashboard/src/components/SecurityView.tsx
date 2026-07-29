import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Laptop } from 'lucide-react';

export const SecurityView: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [upiPinPrompt, setUpiPinPrompt] = useState(true);

  const activeSessions = [
    {
      device: 'Windows PC (This Device)',
      location: 'Mumbai, MH, India',
      ip: '103.22.14.92',
      time: 'Active now',
      icon: Laptop,
    },
    {
      device: 'Samsung Galaxy S24 Ultra',
      location: 'Bengaluru, KA, India',
      ip: '106.51.28.110',
      time: '2 hours ago',
      icon: Smartphone,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Security & UPI Safeguards
        </h2>
        <p className="text-xs text-slate-500">
          Protect your accounts, UPI transactions, and active device sessions according to RBI guidelines.
        </p>
      </div>

      {/* Security Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Security Level: Maximum Protection
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              RBI & NPCI 2-Factor Authentication, UPI PIN lock, and device binding active.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start md:self-auto">
          RBI Compliant
        </span>
      </div>

      {/* Toggles Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 mb-2">UPI & Authentication Settings</h3>

        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Two-Factor SMS OTP Verification</h4>
            <p className="text-xs text-slate-500">Require registered Indian mobile SIM verification on login</p>
          </div>
          <button
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              twoFactor ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Biometric & Fingerprint App Lock</h4>
            <p className="text-xs text-slate-500">Instant unlock via smartphone biometrics</p>
          </div>
          <button
            onClick={() => setBiometrics(!biometrics)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              biometrics ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">UPI PIN Required Above ₹2,000</h4>
            <p className="text-xs text-slate-500">Require 6-digit UPI PIN confirmation for high value payouts</p>
          </div>
          <button
            onClick={() => setUpiPinPrompt(!upiPinPrompt)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              upiPinPrompt ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Active Login Sessions</h3>
        <div className="space-y-3">
          {activeSessions.map((session, i) => {
            const Icon = session.icon;
            return (
              <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{session.device}</h4>
                    <p className="text-[11px] text-slate-500">
                      {session.location} • {session.ip}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600">{session.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
