import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/common/EmptyState';

export default function CartDrawer() {
  const { 
    isCartOpen, setIsCartOpen, 
    cart, removeFromCart, updateCartQuantity, 
    placeOrder, user, navigateTo,
    t 
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState('summary'); // 'summary' | 'shipping' | 'payment' | 'success'
  const [shippingForm, setShippingForm] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'United States'
  });
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '4111 2222 3333 4444',
    cardName: user ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'ALEX RIVERA',
    expiry: '12/28',
    cvv: '123'
  });

  const [errors, setErrors] = useState({});

  if (!isCartOpen) return null;

  // Calculators
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shippingCharge = subtotal > 150 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + tax + shippingCharge;

  const handleClose = () => {
    setIsCartOpen(false);
    setCheckoutStep('summary');
  };

  const handleCheckoutNext = () => {
    if (checkoutStep === 'summary') {
      if (!user) {
        navigateTo('login');
        setIsCartOpen(false);
        return;
      }
      setCheckoutStep('shipping');
    } else if (checkoutStep === 'shipping') {
      if (!shippingForm.fullName || !shippingForm.address || !shippingForm.city || !shippingForm.zipCode) {
        setErrors({ shipping: "All fields are required." });
        return;
      }
      setErrors({});
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      if (!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv) {
        setErrors({ payment: "All fields are required." });
        return;
      }
      setErrors({});
      
      const itemsList = cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }));
      placeOrder({
        total: grandTotal,
        items: itemsList
      });
      setCheckoutStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl z-50 animate-slide-in">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
              {checkoutStep === 'summary' && t('yourCart')}
              {checkoutStep === 'shipping' && t('shippingDetails')}
              {checkoutStep === 'payment' && t('paymentMethod')}
              {checkoutStep === 'success' && t('orderConfirmed')}
            </h3>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Step Content */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
          
          {checkoutStep === 'summary' && (
            cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor.name}`} 
                    className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-xl shrink-0" 
                    />
                    
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Size: {item.selectedSize} | Color: {item.selectedColor.name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 bg-white dark:bg-slate-950">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor.name, item.quantity - 1)}
                            className="text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedSize, item.selectedColor.name, item.quantity + 1)}
                            className="text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white px-1"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-slate-800 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor.name)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="cart"
                title={t('emptyCartTitle')}
                description={t('emptyCartDesc')}
                actionText={t('shop')}
                onActionClick={() => { navigateTo('plp'); handleClose(); }}
              />
            )
          )}

          {checkoutStep === 'shipping' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({...shippingForm, fullName: e.target.value})}
                  className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  placeholder="Alex Rivera"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                  className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  placeholder="742 Evergreen Terrace"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    placeholder="Springfield"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zip Code</label>
                  <input
                    type="text"
                    value={shippingForm.zipCode}
                    onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    placeholder="97477"
                  />
                </div>
              </div>
              {errors.shipping && <p className="text-xs text-rose-500 font-semibold">{errors.shipping}</p>}
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white space-y-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span className="text-xs font-bold tracking-widest">AURA CARD</span>
                </div>
                <div className="text-xl font-bold tracking-wider">{paymentForm.cardNumber || '•••• •••• •••• ••••'}</div>
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="opacity-50">CARDHOLDER</p>
                    <p className="font-bold">{paymentForm.cardName || 'ALEX RIVERA'}</p>
                  </div>
                  <div>
                    <p className="opacity-50">EXPIRES</p>
                    <p className="font-bold">{paymentForm.expiry || '12/28'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                  className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  placeholder="4111 2222 3333 4444"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CVV</label>
                  <input
                    type="password"
                    value={paymentForm.cvv}
                    maxLength="3"
                    onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                    placeholder="123"
                  />
                </div>
              </div>
              {errors.payment && <p className="text-xs text-rose-500 font-semibold">{errors.payment}</p>}
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full">
                <CheckCircle2 className="w-16 h-16 animate-scale-in" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-800 dark:text-white">{t('orderConfirmed')}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thank you for shopping at AuraShop. Your order details have been saved in your Dashboard profile.
                </p>
              </div>
              <button
                onClick={() => { handleClose(); navigateTo('profile'); }}
                className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold rounded-xl hover-scale active-scale transition-all"
              >
                Track Orders
              </button>
            </div>
          )}

        </div>

        {/* Footer calculations */}
        {cart.length > 0 && checkoutStep !== 'success' && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/80 dark:bg-slate-900/80">
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('tax')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shipping')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {shippingCharge === 0 ? 'FREE' : `$${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-base text-slate-800 dark:text-white font-extrabold">
                <span>{t('grandTotal')}</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCheckoutNext}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 transition-all hover-scale active-scale flex items-center justify-center gap-2"
              >
                <span>
                  {checkoutStep === 'summary' && t('proceedCheckout')}
                  {checkoutStep === 'shipping' && t('continuePayment')}
                  {checkoutStep === 'payment' && `${t('pay')} $${grandTotal.toFixed(2)}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('securePayment')}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
