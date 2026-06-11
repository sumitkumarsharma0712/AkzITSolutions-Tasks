import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import CartDrawer from './pages/Checkout/CartDrawer';
import Home from './pages/Storefront/Home';
import PLP from './pages/Storefront/PLP';
import PDP from './pages/Storefront/PDP';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Dashboard/Profile';
import Notifications from './pages/Dashboard/Notifications';
import './App.css';

function AppContent() {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'plp':
        return <PLP />;
      case 'pdp':
        return <PDP />;
      case 'login':
        return <Login />;
      case 'signup':
        return <SignUp />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      {/* Universal Toast Notifications */}
      <ToastContainer />

      {/* Main Sticky Header */}
      <Navbar />

      {/* Slide-out Cart Drawer Overlay */}
      <CartDrawer />

      {/* Dynamic Screen View Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {renderView()}
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
