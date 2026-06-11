import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Bell, Sun, Moon, Search, Menu, X, User, LogOut, Mic, MicOff, Languages, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const { 
    darkMode, setDarkMode, 
    activeTheme, setActiveTheme,
    lang, setLang, t,
    user, handleLogout, 
    cart, 
    notifications, 
    navigateTo, 
    searchQuery, setSearchQuery,
    setIsCartOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const suggestionsRef = useRef(null);

  // Trending search suggestions
  const trendingSuggestions = [
    "Hoodie", "Headphones", "Watch", "Runner", "Wallet", "Sunglasses", "Boots", "Speaker"
  ];

  // Calculate stats
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Handle Search Input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    navigateTo('plp');
  };

  // Web Speech API Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice Search is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'es' ? 'es-ES' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      navigateTo('plp');
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (term) => {
    setSearchQuery(term);
    navigateTo('plp');
    setSuggestionsOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <nav className="glass-navbar sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
              className="text-2xl font-extrabold tracking-wider text-primary-600 dark:text-primary-400 font-sans flex items-center gap-1.5 focus:outline-none"
            >
              <span>AURA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-semibold tracking-normal">SHOP</span>
            </button>
          </div>

          {/* Search bar + Suggestions + Voice mic - Desktop */}
          <div ref={suggestionsRef} className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </div>
            
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSuggestionsOpen(true)}
              className="block w-full pl-10 pr-12 py-2 border border-slate-200 dark:border-slate-800 rounded-full bg-slate-50 dark:bg-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all"
            />

            {/* Voice Mic Icon */}
            <button
              onClick={handleVoiceSearch}
              className={`absolute inset-y-0 right-0 pr-3.5 flex items-center ${
                isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Voice search mic toggle"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Dynamic Suggestions Panel */}
            {suggestionsOpen && (
              <div className="absolute left-0 right-0 mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-scale-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {trendingSuggestions.map((term) => (
                    <button
                      key={term}
                      onClick={() => selectSuggestion(term)}
                      className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation & Controls */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('home')}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
            >
              {t('home')}
            </button>
            <button 
              onClick={() => navigateTo('plp')}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors"
            >
              {t('shop')}
            </button>

            {/* Theme switcher palette */}
            <div className="relative group">
              <button 
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                aria-label="Change color theme"
              >
                <Palette className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2.5 hidden group-hover:block z-50">
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => setActiveTheme('violet')} className="flex items-center gap-2 text-xs font-semibold p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                    <span className="w-3.5 h-3.5 bg-violet-500 rounded-full" /> Violet
                  </button>
                  <button onClick={() => setActiveTheme('blue')} className="flex items-center gap-2 text-xs font-semibold p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                    <span className="w-3.5 h-3.5 bg-sky-500 rounded-full" /> Blue
                  </button>
                  <button onClick={() => setActiveTheme('emerald')} className="flex items-center gap-2 text-xs font-semibold p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full" /> Emerald
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full flex items-center gap-1 text-xs font-bold"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all hover-scale active-scale"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigateTo('notifications')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all relative hover-scale active-scale"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-4 w-4 text-[10px] font-bold text-center leading-4 text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-all relative hover-scale active-scale"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-4 w-4 text-[10px] font-bold text-center leading-4 text-white bg-primary-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm border border-primary-200 dark:border-primary-800">
                    {user.firstName[0].toUpperCase()}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user.firstName} {user.lastName}</p>
                    </div>
                    <button
                      onClick={() => { navigateTo('profile'); setProfileDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <User className="w-4 h-4" /> {t('myProfile')}
                    </button>
                    <button
                      onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 px-4 py-2 rounded-full transition-all hover-scale active-scale"
              >
                {t('signIn')}
              </button>
            )}
          </div>

          {/* Mobile menu trigger buttons */}
          <div className="flex items-center md:hidden gap-2">
            
            {/* Lang switch - Mobile */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="p-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold"
            >
              {lang.toUpperCase()}
            </button>

            {/* Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none"
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            
            {/* Search Input - Mobile */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <button
                onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {t('home')}
              </button>
              <button
                onClick={() => { navigateTo('plp'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {t('shop')}
              </button>
            </div>

            {/* Auth section - Mobile */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-base border border-primary-200">
                      {user.firstName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.firstName} {user.lastName}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { navigateTo('profile'); setMobileMenuOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <User className="w-5 h-5" /> {t('myProfile')}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <LogOut className="w-5 h-5" /> {t('signOut')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  {t('signIn')}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};
