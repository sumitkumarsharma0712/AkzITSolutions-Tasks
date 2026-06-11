import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, ShoppingBag, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockProducts';

export default function Home() {
  const { navigateTo, setCategoryFilter, addToCart, t, recentlyViewed } = useApp();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Hero slider data
  const heroSlides = [
    {
      title: "Audio Perfection Defined",
      subtitle: "Zephyr SoundFlow Headphones",
      description: "Experience premium sound with 45 hours battery life and hybrid active noise cancellation.",
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&q=80&w=1400",
      cta: "Explore Sound",
      productId: 2
    },
    {
      title: "The Cold Weather Capsule",
      subtitle: "Aura Premium Hoodie Collection",
      description: "Meticulously stitched organic heavyweight fleece designed for absolute comfort.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1400",
      cta: "Shop Apparel",
      productId: 1
    },
    {
      title: "Timeless Minimalist Chronograph",
      subtitle: "Vanguard Series Watch",
      description: "Japanese quartz movement encased in scratch-resistant sapphire crystal.",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=1400",
      cta: "View Collection",
      productId: 3
    }
  ];

  // Auto-rotate hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextHero = () => {
    setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length);
  };

  const handlePrevHero = () => {
    setCurrentHeroIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Categories
  const categories = [
    { name: "Apparel", count: "3 Products", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
    { name: "Electronics", count: "3 Products", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { name: "Footwear", count: "2 Products", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
    { name: "Accessories", count: "4 Products", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400" }
  ];

  // Filter trending products
  const trendingProducts = mockProducts.filter(p => p.isTrending);

  // Filter AI Recommended products based on recently viewed items or defaults
  const recommendedProducts = mockProducts.filter(p => {
    if (recentlyViewed.length > 0) {
      return recentlyViewed.includes(p.id);
    }
    // Default recommendations if no recently viewed history
    return p.rating >= 4.7 && !p.isTrending;
  }).slice(0, 4);

  const handleCategoryClick = (categoryName) => {
    setCategoryFilter(categoryName);
    navigateTo('plp');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Promotional Slider */}
      <section className="relative h-[480px] md:h-[580px] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-500">
        
        {/* Carousel Slide */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
          style={{ backgroundImage: `url(${heroSlides[currentHeroIndex].image})` }}
        >
          <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 transition-colors" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-2xl text-white space-y-4">
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-400">
            {heroSlides[currentHeroIndex].title}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {heroSlides[currentHeroIndex].subtitle}
          </h1>
          <p className="text-sm md:text-base text-slate-200 line-clamp-2">
            {heroSlides[currentHeroIndex].description}
          </p>
          <div className="pt-4 flex gap-4">
            <button
              onClick={() => navigateTo('pdp', heroSlides[currentHeroIndex].productId)}
              className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-semibold text-sm transition-all hover-scale active-scale flex items-center gap-2 shadow-lg"
            >
              <span>{heroSlides[currentHeroIndex].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setCategoryFilter(''); navigateTo('plp'); }}
              className="px-6 py-3 border border-white/30 backdrop-blur-sm text-white hover:bg-white/10 rounded-full font-semibold text-sm transition-all hover-scale active-scale"
            >
              Shop All Catalog
            </button>
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={handlePrevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/20 bg-slate-900/20 text-white hover:bg-slate-900/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/20 bg-slate-900/20 text-white hover:bg-slate-900/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentHeroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </section>

      {/* 2. Shop by Category Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">{t('shopByCategory')}</h2>
            <p className="text-sm text-slate-500">{t('categoryDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative h-48 rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white text-left">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{cat.count}</span>
                <h3 className="text-lg font-bold mt-1">{cat.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Trending Products Carousel */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">{t('trendingNow')}</h2>
            <p className="text-sm text-slate-500">{t('popularDesc')}</p>
          </div>
          <button 
            onClick={() => { setCategoryFilter(''); navigateTo('plp'); }}
            className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>{t('seeAllItems')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth">
          {trendingProducts.map((product) => (
            <div 
              key={product.id}
              className="min-w-[280px] md:min-w-[300px] max-w-[300px] snap-start bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
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

                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigateTo('pdp', product.id)}
                    className="p-3 bg-white hover:bg-slate-50 text-slate-900 rounded-full shadow-lg hover-scale active-scale transition-all"
                    aria-label={`View ${product.name}`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {product.stock > 0 && (
                    <button
                      onClick={() => addToCart(product, 1, product.sizes[0], product.colors[0])}
                      className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover-scale active-scale transition-all"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

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
          ))}
        </div>
      </section>

      {/* 4. AI Recommended/Inspired by History Products */}
      {recommendedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">{t('recommended')}</h2>
            <p className="text-sm text-slate-500">{t('inspiredByHistory')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigateTo('pdp', product.id)}
                      className="p-2.5 bg-white text-slate-900 rounded-full shadow-lg hover-scale active-scale"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 onClick={() => navigateTo('pdp', product.id)} className="font-bold text-sm text-slate-850 dark:text-slate-100 truncate cursor-pointer hover:text-primary-500">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => navigateTo('pdp', product.id)}
                      className="text-xs font-medium text-primary-600 dark:text-primary-400"
                    >
                      {t('learnMore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
