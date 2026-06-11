import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, ArrowLeft, RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockProducts';
import { Skeleton } from '../../components/common/Skeleton';

export default function PDP() {
  const { selectedProductId, navigateTo, addToCart, wishlist, toggleWishlist, t } = useApp();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  
  // AR Simulation Modal State
  const [arOpen, setArOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Find product by id
  useEffect(() => {
    setLoading(true);
    const item = mockProducts.find(p => p.id === selectedProductId) || mockProducts[0];
    const timer = setTimeout(() => {
      setProduct(item);
      setSelectedSize(item.sizes[0]);
      setSelectedColor(item.colors[0]);
      setQuantity(1);
      setActiveImageIndex(0);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedProductId]);

  // Zoom on hover handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[activeImageIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  // AR 3D rotation simulation events
  const handleArStart = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
  };

  const handleArMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches[0].clientX;
    const diff = clientX - startX;
    setRotation(prev => prev + diff * 0.5);
    setStartX(clientX);
  };

  const handleArEnd = () => {
    setIsDragging(false);
  };

  // Find related products in same category (AI Recommendation engine)
  const relatedProducts = product 
    ? mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  if (loading || !product) {
    return (
      <div className="py-8 space-y-8 animate-pulse">
        <button className="flex items-center gap-2 text-sm text-slate-400 font-semibold">
          <ArrowLeft className="w-4 h-4" /> {t('backToCatalog')}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-3xl" variant="rect" />
            <div className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-xl" variant="rect" />
              <Skeleton className="w-20 h-20 rounded-xl" variant="rect" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="w-1/3 h-4" variant="text" />
            <Skeleton className="w-3/4 h-10" variant="text" />
            <Skeleton className="w-1/4 h-8" variant="text" />
            <Skeleton className="w-full h-24" variant="rect" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12">
      {/* Back navigation */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigateTo('plp')}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToCatalog')}
        </button>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-sm hover-scale active-scale focus:outline-none"
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left: Gallery & Zoom */}
        <div className="space-y-4">
          
          <div 
            className="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                ...zoomStyle,
                backgroundRepeat: 'no-repeat'
              }}
            />

            {/* Simulated 3D / AR Preview trigger button */}
            <button
              onClick={() => setArOpen(true)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg active-scale transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t('arPreview')}</span>
            </button>
          </div>

          {/* Carousel thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border transition-all ${
                    i === activeImageIndex 
                      ? 'border-primary-600 ring-2 ring-primary-500/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details Info */}
        <div className="space-y-6">
          
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {product.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.stock > 5 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                : product.stock > 0
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
            }`}>
              {product.stock > 5 ? t('inStock') : product.stock > 0 ? t('onlyLeft', { count: product.stock }) : t('soldOut')}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${
                      s <= Math.floor(product.rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300 dark:text-slate-700'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {product.description}
          </p>

          {/* Color Variant Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('colorVariant')}: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedColor?.name}</span>
            </span>
            <div className="flex gap-3">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border transition-all ${
                    selectedColor?.name === color.name 
                      ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-950' 
                      : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.name}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes[0] !== "One Size" && product.sizes[0] !== "Standard" && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('selectSize')}: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSize}</span>
              </span>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-10 h-10 px-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Cart buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:w-32">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white focus:outline-none"
              >
                -
              </button>
              <span className="font-bold text-slate-800 dark:text-slate-200">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white focus:outline-none"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-grow flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all hover-scale active-scale ${
                product.stock > 0 
                  ? 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/10' 
                  : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500 dark:text-slate-600'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{product.stock > 0 ? t('addToCart') : t('soldOut')}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-1">
              <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{t('freeDelivery')}</span>
              <span className="text-[9px] text-slate-400">Over $150</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-1">
              <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{t('returns')}</span>
              <span className="text-[9px] text-slate-400">Guaranteed</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{t('certified')}</span>
              <span className="text-[9px] text-slate-400">100% original</span>
            </div>
          </div>

        </div>

      </div>

      {/* AR Interactive Preview Modal */}
      {arOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div onClick={() => setArOpen(false)} className="absolute inset-0 cursor-pointer" />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center space-y-4 animate-scale-in">
            <div className="flex justify-between items-center w-full">
              <h3 className="font-extrabold text-lg flex items-center gap-1.5">
                <RotateCw className="w-5 h-5 text-primary-500 animate-spin" />
                <span>Simulated AR 3D View</span>
              </h3>
              <button onClick={() => setArOpen(false)} className="text-sm font-bold text-slate-400">Close</button>
            </div>

            <p className="text-xs text-slate-400 text-center">Drag horizontally on the card image below to rotate the product in 3D Space.</p>
            
            {/* Rotate Canvas */}
            <div 
              onMouseDown={handleArStart}
              onMouseMove={handleArMove}
              onMouseUp={handleArEnd}
              onMouseLeave={handleArEnd}
              onTouchStart={handleArStart}
              onTouchMove={handleArMove}
              onTouchEnd={handleArEnd}
              className="w-80 h-80 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex items-center justify-center cursor-ew-resize select-none relative"
            >
              <img
                src={product.images[activeImageIndex]}
                alt="3d-rotation"
                className="w-3/4 h-3/4 object-contain transition-transform pointer-events-none duration-75"
                style={{ transform: `rotateY(${rotation}deg)` }}
              />
              <div className="absolute bottom-2 text-[10px] font-bold bg-slate-900/40 text-white px-3 py-1 rounded-full">
                Rotation: {Math.round(rotation)}°
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setRotation(r => r - 90)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
              >
                Rotate Left
              </button>
              <button 
                onClick={() => setRotation(0)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
              >
                Reset Orientation
              </button>
              <button 
                onClick={() => setRotation(r => r + 90)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
              >
                Rotate Right
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended items based on Active category */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight">{t('recommended')}</h2>
            <p className="text-sm text-slate-500">Related items in {product.category}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => navigateTo('pdp', p.id)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover-scale flex flex-col"
              >
                <div className="aspect-square bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="font-bold text-sm truncate">{p.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-black text-sm">${p.price.toFixed(2)}</span>
                    <span className="text-xs text-primary-500 font-semibold">{t('learnMore')}</span>
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
