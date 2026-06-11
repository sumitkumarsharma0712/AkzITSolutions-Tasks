import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SignUp() {
  const { handleSignUp, navigateTo, showToast } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: 'bg-slate-200' });

  // Calculate password strength dynamically
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, text: '', color: 'bg-slate-200' };

    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    let text = 'Weak';
    let color = 'bg-rose-500';

    if (score === 2) {
      text = 'Medium';
      color = 'bg-amber-500';
    } else if (score >= 3) {
      text = 'Strong';
      color = 'bg-emerald-500';
    }

    return { score, text, color };
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setFormData(prev => ({ ...prev, password: pwd }));
    setPasswordStrength(checkPasswordStrength(pwd));
    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required.";
    
    if (!formData.email) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email format.";
    }

    if (!formData.password) {
      tempErrors.password = "Password field is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      tempErrors.acceptTerms = "You must accept the Terms & Conditions.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSignUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatar: ""
      });
    } else {
      showToast("Please correct the mistakes on the form.", "error");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 animate-scale-in">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join AuraShop and discover premium curated lifestyle goods.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            
            {/* Names row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.firstName ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.lastName ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                  }`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Strength Meter */}
              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Strength:</span>
                    <span className={`font-bold ${
                      passwordStrength.text === 'Weak' ? 'text-rose-500' :
                      passwordStrength.text === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{passwordStrength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4.5 w-4.5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded-md bg-slate-50 dark:bg-slate-900 dark:border-slate-800"
                />
                <label htmlFor="acceptTerms" className="ml-2.5 block text-sm text-slate-600 dark:text-slate-400">
                  I accept the{" "}
                  <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                    Terms & Conditions
                  </a>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-xs text-rose-500 mt-1">{errors.acceptTerms}</p>}
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white shadow-lg transition-all hover-scale active-scale focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            <span>Create Account</span>
            <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
          </button>
        </form>

        {/* Redirect */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <button
              onClick={() => navigateTo('login')}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
