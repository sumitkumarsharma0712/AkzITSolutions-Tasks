import React, { useState, useEffect } from 'react';
import { Filter, Star, Search, SlidersHorizontal, ChevronRight, Eye, ShoppingBag, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockProducts';
import { ProductSkeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

export default function PLP() {
  const { 
    navigateTo, 
    categoryFilter, setCategoryFilter, 
    searchQuery, setSearchQuery, 
    addToCart, 
    wishlist, toggleWishlist,
    t 
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'All');
  const [priceRange, setPriceRange] = useState(300); // Max price
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync category filter from global state
  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Mock loading animation when filters change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCategory, priceRange, minRating, sortBy, searchQuery]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCategoryFilter(cat === 'All' ? '' : cat);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setCategoryFilter('');
    setPriceRange(300);
    setMinRating(0);
    setSortBy('newest');
    setSearchQuery('');
  };

  // Filter & Sort Logic
  const filteredProducts = mockProducts
    .filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= priceRange;
      const matchesRating = product.rating >= minRating;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    });

  const categoriesList = ['All', 'Apparel', 'Electronics', 'Footwear', 'Accessories'];

  return (
    <div className="pb-16 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{t('catalog')}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('showingItems', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Search, Sort and Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none block w-full px-4 py-2 pr-8 border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Sort products"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-low">{t('sortLowHigh')}</option>
              <option value="price-high">{t('sortHighLow')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900"
          >
            <Filter className="w-4 h-4" />
            <span>{t('filters')}</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* 1. Sidebar Filtering - Desktop */}
        <aside className="hidden md:block space-y-6 p-6 border border-slate-100 dark:border-slate-800/80 rounded-3xl bg-white dark:bg-slate-900 shadow-sm sticky top-24">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">{t('filters')}</h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              {t('resetAll')}
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('category')}</h4>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center justify-between w-full text-left py-1.5 px-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 transition-opacity ${selectedCategory === cat ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('maxPrice')}</h4>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="5"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
              aria-label="Filter by price range"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>$20</span>
              <span>$300</span>
            </div>
          </div>

          {/* Ratings Filter */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('minRating')}</h4>
            <div className="space-y-2">
              {[4.7, 4.5, 4.0, 0].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded-lg text-sm transition-colors ${
                    minRating === rating
                      ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs">
                    {rating === 0 ? 'All Ratings' : `${rating} & Up`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            <div 
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <div className="relative w-80 max-w-full bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between animate-slide-in shadow-xl z-50">
              <div className="space-y-6 overflow-y-auto flex-grow pr-2">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-lg">{t('filters')}</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-sm font-semibold text-slate-400">Close</button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('category')}</h4>
                  <div className="space-y-1">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { handleCategoryChange(cat); }}
                        className={`flex items-center justify-between w-full py-2 px-3 rounded-xl text-sm ${
                          selectedCategory === cat ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold' : ''
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('maxPrice')}</h4>
                    <span className="text-sm font-bold">${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('minRating')}</h4>
                  <div className="space-y-2">
                    {[4.7, 4.5, 4.0, 0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm w-full ${minRating === rating ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}
                      >
                        {rating === 0 ? 'All' : `${rating} & Up`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <button
                  onClick={handleResetFilters}
                  className="flex-grow py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 text-slate-600"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-grow py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 rounded-xl text-sm font-semibold hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Product Grid Content */}
        <main className="col-span-1 md:col-span-3">
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <ProductSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col hover-scale"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm rounded-full shadow-md hover-scale transition-transform focus:outline-none"
                        aria-label="Add to wishlist"
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors ${
                            isWishlisted 
                              ? 'fill-rose-500 text-rose-500' 
                              : 'text-slate-400 hover:text-rose-500'
                          }`} 
                        />
                      </button>

                      {/* Badge tags */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary-600 text-white rounded-md">
                            {t('new')}
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded-md">
                            {t('soldOut')}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigateTo('pdp', product.id)}
                          className="p-3 bg-white text-slate-900 rounded-full shadow-lg hover-scale active-scale"
                          aria-label={`View ${product.name}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {product.stock > 0 && (
                          <button
                            onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                            className="p-3 bg-primary-600 text-white rounded-full shadow-lg hover-scale active-scale"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Description */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                          {product.category}
                        </span>
                        <button
                          onClick={() => navigateTo('pdp', product.id)}
                          className="block text-left text-base font-bold text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 mt-1 line-clamp-1 truncate"
                        >
                          {product.name}
                        </button>

                        <div className="flex items-center gap-1.5 mt-2">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
                          <span className="text-xs text-slate-400">({product.reviews})</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-5">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => navigateTo('pdp', product.id)}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600"
                        >
                          {t('learnMore')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon="search"
              title={t('noMatch')}
              description={t('adjustFilters')}
              actionText={t('resetAll')}
              onActionClick={handleResetFilters}
            />
          )}

        </main>

      </div>
    </div>
  );
}
