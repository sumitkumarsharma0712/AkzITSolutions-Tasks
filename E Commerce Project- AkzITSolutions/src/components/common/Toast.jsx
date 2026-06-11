import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }) => {
  const { id, message, type } = toast;
  
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const bgClasses = {
    success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/30",
    error: "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/30",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30"
  };

  return (
    <div 
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border glass-card animate-scale-in ${bgClasses[type]}`}
      role="alert"
    >
      {iconMap[type]}
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-grow">
        {message}
      </p>
    </div>
  );
};
