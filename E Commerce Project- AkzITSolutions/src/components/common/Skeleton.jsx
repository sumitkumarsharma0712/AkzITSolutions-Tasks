import React from 'react';

export const Skeleton = ({ className, variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-800";
  
  const variantClasses = {
    circle: "rounded-full",
    text: "rounded h-4 w-full",
    rect: "rounded-lg"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="progressbar"
      aria-label="Loading content placeholder"
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="space-y-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
      <Skeleton className="w-full aspect-square" variant="rect" />
      <div className="space-y-2">
        <Skeleton className="w-1/3 h-4" variant="text" />
        <Skeleton className="w-3/4 h-6" variant="text" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="w-1/4 h-5" variant="text" />
          <Skeleton className="w-8 h-8 rounded-full" variant="circle" />
        </div>
      </div>
    </div>
  );
};
