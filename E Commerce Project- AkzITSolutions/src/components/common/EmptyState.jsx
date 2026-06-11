import React from 'react';
import { ShoppingBag, Search, Bell } from 'lucide-react';

export const EmptyState = ({ 
  icon = 'cart', 
  title = "No items found", 
  description = "Start exploring and add some products!",
  actionText,
  onActionClick
}) => {
  
  const iconMap = {
    cart: <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 animate-bounce" />,
    search: <Search className="w-16 h-16 text-slate-300 dark:text-slate-700" />,
    notifications: <Bell className="w-16 h-16 text-slate-300 dark:text-slate-700" />
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 max-w-md mx-auto space-y-6">
      <div className="p-5 bg-slate-100 dark:bg-slate-900 rounded-full">
        {iconMap[icon] || iconMap.cart}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {actionText && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-primary-500/10 hover-scale active-scale"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
