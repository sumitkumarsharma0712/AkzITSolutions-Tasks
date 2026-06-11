import React, { createContext, useState, useEffect, useContext } from 'react';
import { defaultNotifications } from '../data/mockProducts';
import { translations } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme & Color State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('activeTheme') || 'violet';
  });

  // Localization State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // User Saved Addresses
  const [addresses, setAddresses] = useState(() => {
    const savedAddresses = localStorage.getItem('addresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [
      {
        id: 1,
        fullName: "Alex Rivera",
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        zipCode: "97477",
        country: "United States",
        isDefault: true
      }
    ];
  });

  // Order History State
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      {
        id: "ORD-9421",
        date: "2026-06-01",
        total: 249.99,
        items: [
          { name: "Zephyr SoundFlow Headphones", quantity: 1, price: 249.99 }
        ],
        status: "Delivered"
      },
      {
        id: "ORD-8942",
        date: "2026-05-15",
        total: 139.98,
        items: [
          { name: "Leather Nomad Wallet", quantity: 1, price: 49.99 },
          { name: "Aura Premium Hoodie", quantity: 1, price: 89.99 }
        ],
        status: "Processing"
      }
    ];
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [1, 3]; // Default wishlist ids
  });

  // Gamified Rewards State
  const [rewards, setRewards] = useState(() => {
    const savedRewards = localStorage.getItem('rewards');
    return savedRewards ? JSON.parse(savedRewards) : {
      points: 1250,
      streak: 3,
      badges: ["First Milestone", "Trend Setter"]
    };
  });

  // AI Recommendation Engine (Recently Viewed)
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedRecently = localStorage.getItem('recentlyViewed');
    return savedRecently ? JSON.parse(savedRecently) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : defaultNotifications;
  });

  // Router State
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Connection State
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Toasts State
  const [toasts, setToasts] = useState([]);

  // Translation Helper
  const t = (key, replaceParams = {}) => {
    let text = translations[lang][key] || key;
    Object.keys(replaceParams).forEach(param => {
      text = text.replace(`{${param}}`, replaceParams[param]);
    });
    return text;
  };

  // Sync network state
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast(t('onlineNotification'), 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast(t('offlineWarning'), 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang]);

  // Apply dark mode & theme class variables
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply Dark Mode
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);

    // Apply Active Color Theme
    root.classList.remove('theme-violet', 'theme-blue', 'theme-emerald');
    root.classList.add(`theme-${activeTheme}`);
    localStorage.setItem('activeTheme', activeTheme);
  }, [darkMode, activeTheme]);

  // Persist states to localstorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Cart functions
  const addToCart = (product, quantity, size, color) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor.name === color.name
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        showToast(t('yourCart') + " -> Updated " + product.name);
        return updatedCart;
      } else {
        showToast(product.name + " added.");
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          selectedSize: size,
          selectedColor: color,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (id, size, colorName) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === id && i.selectedSize === size && i.selectedColor.name === colorName);
      if (item) {
        showToast(item.name + " removed.", 'info');
      }
      return prevCart.filter(i => !(i.id === id && i.selectedSize === size && i.selectedColor.name === colorName));
    });
  };

  const updateCartQuantity = (id, size, colorName, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === id && item.selectedSize === size && item.selectedColor.name === colorName)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Toggle
  const toggleWishlist = (productId) => {
    let added = false;
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        added = true;
        return [...prev, productId];
      }
    });
    
    // Simulate sale alert on wishlist add
    if (added) {
      showToast("Saved to wishlist.");
      setTimeout(() => {
        addNotification(
          t('onSaleBadge') + " Aura Flash Alert!",
          `Item added to your wishlist is now on a 15% off simulated flash deal.`,
          "sale"
        );
      }, 5000);
    } else {
      showToast("Removed from wishlist.", "info");
    }
  };

  // Track product views for recommendations
  const trackProductView = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 4);
    });
  };

  // Notifications functions
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications read.");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast("Notifications cleared.", "info");
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: "Just now",
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Navigation Helper
  const navigateTo = (view, productId = null) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
      trackProductView(productId);
    }
    // Scroll to top automatically
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const handleSignUp = (userData) => {
    setUser(userData);
    showToast(`Welcome ${userData.firstName}!`);
    addNotification(
      "Account Created Successfully",
      `Welcome to AuraShop, ${userData.firstName}! Enjoy exploring our luxury curated products.`,
      "info"
    );
    navigateTo('home');
  };

  const handleLogin = (email, password, rememberMe) => {
    const firstName = email.split('@')[0];
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const mockUser = {
      firstName: formattedFirstName,
      lastName: "User",
      email: email,
      avatar: ""
    };
    setUser(mockUser);
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    showToast(`Welcome back, ${formattedFirstName}!`);
    navigateTo('home');
  };

  const handleLogout = () => {
    setUser(null);
    showToast("Logged out.", "info");
    navigateTo('home');
  };

  // Addresses operations
  const saveAddress = (address) => {
    if (address.id) {
      setAddresses(prev => prev.map(a => a.id === address.id ? address : a));
      showToast("Address updated.");
    } else {
      const newAddress = { ...address, id: Date.now() };
      if (newAddress.isDefault) {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      showToast("Address added.");
    }
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Address deleted.", "info");
  };

  // Checkout Operations (with gamification updates!)
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      total: orderDetails.total,
      items: orderDetails.items,
      status: "Processing"
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Reward points calculations (10 points per dollar spent)
    const pointsEarned = Math.floor(orderDetails.total * 10);
    setRewards(prev => {
      const updatedBadges = [...prev.badges];
      if (prev.streak >= 3 && !updatedBadges.includes("Loyal Streaker")) {
        updatedBadges.push("Loyal Streaker");
      }
      if (orderDetails.total >= 200 && !updatedBadges.includes("Big Spender")) {
        updatedBadges.push("Big Spender");
      }
      return {
        points: prev.points + pointsEarned,
        streak: prev.streak + 1,
        badges: updatedBadges
      };
    });

    addNotification(
      "Order Placed Confirmed",
      `Your order ${newOrder.id} has been received. You earned +${pointsEarned} Aura Points!`,
      "info"
    );
    showToast("Order placed successfully!");
  };

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      activeTheme, setActiveTheme,
      lang, setLang, t,
      user, setUser, handleSignUp, handleLogin, handleLogout,
      addresses, saveAddress, deleteAddress,
      orders, placeOrder,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      wishlist, toggleWishlist,
      rewards, setRewards,
      recentlyViewed,
      notifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications, addNotification,
      currentView, navigateTo, selectedProductId,
      searchQuery, setSearchQuery,
      categoryFilter, setCategoryFilter,
      isCartOpen, setIsCartOpen,
      isOnline,
      toasts, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
