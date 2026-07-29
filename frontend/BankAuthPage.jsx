import React, { useState, useMemo } from 'react';
import { Landmark, Eye, EyeOff, Loader2, ShieldCheck, Check } from 'lucide-react';

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–3
}

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Strong'];
const STRENGTH_COLOR = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-500'];

export default function BankAuthPage() {
  const [view, setView] = useState('login'); // 'login' | 'signup'

  // ---- Login state ----
  const [loginMethod, setLoginMethod] = useState('account'); // 'account' | 'phone'
  const [accountNumber, setAccountNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ---- Sign-up state ----
  const [fullName, setFullName] = useState('');
  const [suAccountNumber, setSuAccountNumber] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [email, setEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuPassword, setShowSuPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(suPassword), [suPassword]);
  const passwordsMismatch = confirmPassword.length > 0 && suPassword !== confirmPassword;
  const canSubmitSignup =
    fullName.trim() &&
    suAccountNumber.length === 10 &&
    suPhone.length === 10 &&
    email.trim() &&
    suPassword &&
    !passwordsMismatch &&
    agreeTerms;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    // Simulated 1.5s secure auth check — replace with real auth call.
    setTimeout(() => setIsLoggingIn(false), 1500);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (isSigningUp || !canSubmitSignup) return;
    setIsSigningUp(true);
    // Simulated 1.5s account-creation check — replace with real signup call.
    setTimeout(() => setIsSigningUp(false), 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-2xl px-6 py-8 sm:px-10 sm:py-10">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-11 w-11 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <Landmark className="h-5 w-5 text-white" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {view === 'login' ? 'Sign in to your account' : 'Register for online banking'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {view === 'login'
                ? 'Enter your credentials to access your accounts'
                : 'Link your existing account to create digital access'}
            </p>
          </div>

          {view === 'login' ? (
            <>
              {/* Segmented control */}
              <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginMethod('account')}
                  className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    loginMethod === 'account'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Account Number
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    loginMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Phone Number
                </button>
              </div>

              {/* Login form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {loginMethod === 'account' ? (
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit Account Number"
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Registered Phone Number
                    </label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent">
                      <span className="flex items-center px-3 text-sm text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        autoComplete="off"
                        className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberDevice}
                    onClick={() => setRememberDevice((v) => !v)}
                    className="flex items-center gap-2 group"
                  >
                    <span
                      className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                        rememberDevice
                          ? 'bg-slate-900 border-slate-900'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {rememberDevice && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    <span className="text-sm text-slate-600">Remember device</span>
                  </button>

                  <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    Forgot password or account number?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in securely…</span>
                    </>
                  ) : (
                    'Secure Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or fast-track with linked accounts</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Google shortcut — login only, verified/linked accounts only */}
              <div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Only for pre-verified and linked profiles
                </p>
              </div>

              {/* Sign-up hand-off */}
              <p className="mt-7 text-center text-sm text-slate-500">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="font-medium text-slate-900 hover:underline underline-offset-2"
                >
                  Open an account
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Sign-up form */}
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="As per bank records"
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="suAccountNumber" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Account Number
                  </label>
                  <input
                    id="suAccountNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={suAccountNumber}
                    onChange={(e) => setSuAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Account Number"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="suPhone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Registered Phone Number
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent">
                    <span className="flex items-center px-3 text-sm text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                      +91
                    </span>
                    <input
                      id="suPhone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={suPhone}
                      onChange={(e) => setSuPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      autoComplete="off"
                      className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="suPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      id="suPassword"
                      type={showSuPassword ? 'text' : 'password'}
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuPassword((v) => !v)}
                      aria-label={showSuPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showSuPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {suPassword && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              strength >= i ? STRENGTH_COLOR[strength] : 'bg-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 w-10 text-right">
                        {STRENGTH_LABEL[strength]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:border-transparent ${
                        passwordsMismatch
                          ? 'border-rose-300 focus:ring-rose-400'
                          : 'border-slate-200 focus:ring-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordsMismatch && (
                    <p className="mt-1.5 text-xs text-rose-500">Passwords don't match</p>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreeTerms}
                    onClick={() => setAgreeTerms((v) => !v)}
                    className="flex items-start gap-2.5 group text-left"
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
                        agreeTerms
                          ? 'bg-slate-900 border-slate-900'
                          : 'border-slate-300 bg-white group-hover:border-slate-400'
                      }`}
                    >
                      {agreeTerms && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    <span className="text-sm text-slate-600">
                      I agree to the{' '}
                      <span className="font-medium text-slate-900 hover:underline">Terms of Service</span>{' '}
                      and{' '}
                      <span className="font-medium text-slate-900 hover:underline">Privacy Policy</span>
                    </span>
                  </button>
                  {submitAttempted && !agreeTerms && (
                    <p className="mt-1.5 text-xs text-rose-500">
                      Please accept the terms to continue
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating your account…</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Login hand-off — no Google option on this view */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="font-medium text-slate-900 hover:underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>

        {/* Trust & compliance footer */}
        <div className="mt-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secured with 256-bit banking encryption
          </p>
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Contact Support</a>
            <span className="text-slate-300">·</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <span className="text-slate-300">·</span>
            <a href="#" className="hover:text-slate-600 transition-colors">Security Guarantee</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.65h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.11A11.998 11.998 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.27a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.6l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}
