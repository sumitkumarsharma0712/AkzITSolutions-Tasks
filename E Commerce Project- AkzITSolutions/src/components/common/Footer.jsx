import React from 'react';
import { Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="text-xl font-extrabold tracking-wider text-primary-600 dark:text-primary-400 font-sans">
              AURA<span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-semibold tracking-normal ml-1">SHOP</span>
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A premium, minimalist design experience offering curated garments, accessories, and audio gear for the modern nomad.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.139.052 1.907.25 2.436.457.545.21 1.01.536 1.417.943.407.408.734.872.944 1.417.206.528.404 1.297.456 2.436.044.926.054 1.28.054 3.71s-.01 2.784-.054 3.71c-.052 1.14-.25 1.908-.456 2.437a4.887 4.887 0 01-.944 1.417 4.887 4.887 0 01-1.417.944c-.529.206-1.297.404-2.436.456-.926.044-1.28.054-3.71.054s-2.784-.01-3.71-.054c-1.139-.052-1.907-.25-2.436-.457a4.877 4.877 0 01-1.417-.944 4.893 4.893 0 01-.943-1.417c-.206-.528-.404-1.297-.457-2.436C2.01 14.784 2 14.3 2 11.999s.01-2.784.054-3.71c.052-1.139.25-1.908.457-2.436a4.894 4.894 0 01.943-1.417 4.893 4.893 0 011.417-.943c.528-.206 1.297-.404 2.436-.456.926-.044 1.28-.054 3.71-.054zM12 5.802a6.197 6.197 0 100 12.393 6.197 6.197 0 000-12.393zm0 2.213a3.984 3.984 0 110 7.968 3.984 3.984 0 010-7.968zm5.556-.226a1.215 1.215 0 11-2.43 0 1.215 1.215 0 012.43 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Apparel</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Electronics</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Footwear</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Stay Connected
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subscribe to retrieve product drops, promotional updates, and exclusive discount codes.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="flex-grow px-4 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 hover-scale active-scale transition-all"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; 2026 AuraShop Inc. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern web environments.
          </p>
        </div>

      </div>
    </footer>
  );
};
