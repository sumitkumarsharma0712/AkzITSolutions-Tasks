import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const { handleLogin, navigateTo, showToast } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState({});

  // Auto fill remembered email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email format.";
    }
    
    if (!password) {
      tempErrors.password = "Password field cannot be empty.";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleLogin(email, password, rememberMe);
    } else {
      showToast("Please fix the validation errors.", "error");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please type your email address first.", "error");
      return;
    }
    showToast(`Password reset link has been dispatched to ${email}`, "info");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 animate-scale-in">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your premium dashboard and tracking.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password 
                      ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.password}</p>
              )}
            </div>

          </div>

          {/* Remember Me Toggle */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded-md bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
            />
            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-700 dark:text-slate-300">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white shadow-lg transition-all hover-scale active-scale focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            <span>Sign In</span>
            <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
          </button>
        </form>

        {/* Redirect */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            New to AuraShop?{" "}
            <button
              onClick={() => navigateTo('signup')}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus:outline-none"
            >
              Create an account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
