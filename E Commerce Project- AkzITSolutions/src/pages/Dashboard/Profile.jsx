import React, { useState } from 'react';
import { User, MapPin, Package, Edit3, Plus, Trash2, Camera, Calendar, Award, Flame, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockProducts';

export default function Profile() {
  const { 
    user, setUser, 
    addresses, saveAddress, deleteAddress, 
    orders, rewards, wishlist, toggleWishlist, addToCart, navigateTo,
    t 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'details' | 'addresses' | 'wishlist'
  
  const [profileForm, setProfileForm] = useState({
    firstName: user ? user.firstName : 'Alex',
    lastName: user ? user.lastName : 'Rivera',
    email: user ? user.email : 'alex.rivera@example.com'
  });

  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email
    }));
    t('editDetails');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.street || !newAddress.city || !newAddress.zipCode) {
      return;
    }
    saveAddress(newAddress);
    setAddressFormOpen(false);
    setNewAddress({
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false
    });
  };

  // Find wishlist products
  const wishlistProducts = mockProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="pb-16 space-y-8">
      
      {/* Header Banner */}
      <div className="relative h-48 rounded-3xl bg-slate-900 dark:bg-slate-950 overflow-hidden flex items-end p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-indigo-600/20" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 z-10 translate-y-8 sm:translate-y-12 w-full">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 flex items-center justify-center font-extrabold text-3xl sm:text-4xl border-4 border-slate-50 dark:border-slate-950 shadow-lg">
              {profileForm.firstName[0]?.toUpperCase()}
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full border border-slate-800 shadow-md group-hover:scale-105 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1 mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {profileForm.firstName} {profileForm.lastName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profileForm.email}</p>
          </div>
        </div>
      </div>

      {/* Gamified Rewards Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <div className="p-6 border border-slate-100 dark:border-slate-800/85 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{t('rewardPoints')}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{rewards.points} pts</h4>
            <p className="text-[10px] text-slate-500 mt-1">{t('pointsDescription')}</p>
          </div>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-800/85 rounded-3xl bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">{t('purchaseStreak')}</p>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{rewards.streak} {t('streakUnit')}</h4>
            <p className="text-[10px] text-slate-500 mt-1">Make purchases to keep the streak hot!</p>
          </div>
        </div>

        <div className="p-6 border border-slate-100 dark:border-slate-800/85 rounded-3xl bg-white dark:bg-slate-900 shadow-sm space-y-2.5">
          <p className="text-xs text-slate-400 uppercase font-semibold">{t('unlockedBadges')}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {rewards.badges.map((badge, idx) => (
              <span key={idx} className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                ⭐ {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs list navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/80 pt-6 gap-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'orders' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('orderHistory')}</span>
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'wishlist' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t('wishlistTitle')}</span>
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'details' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{t('accountSettings')}</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'addresses' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('savedAddresses')}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-4 animate-fade-in">
        
        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">{t('pastTransactions')}</h3>
            {orders.length > 0 ? (
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-x-auto bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="py-4.5 px-6">Order ID</th>
                      <th className="py-4.5 px-6">Purchase Date</th>
                      <th className="py-4.5 px-6">Status</th>
                      <th className="py-4.5 px-6">Items Purchased</th>
                      <th className="py-4.5 px-6 text-right">Total price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="py-4.5 px-6 font-bold text-slate-800 dark:text-slate-200">{order.id}</td>
                        <td className="py-4.5 px-6 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{order.date}</span>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-4.5 px-6 text-right font-black text-slate-900 dark:text-white">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                You haven't made any purchases yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Wishlist (NEW FEATURE) */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold">{t('wishlistTitle')}</h3>
              <p className="text-xs text-slate-500 mt-1">{t('wishlistDesc')}</p>
            </div>

            {wishlistProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex gap-4">
                    <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded-xl shrink-0 bg-slate-50 dark:bg-slate-950" />
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 onClick={() => navigateTo('pdp', p.id)} className="font-bold text-sm truncate hover:text-primary-500 cursor-pointer">{p.name}</h4>
                          <button onClick={() => toggleWishlist(p.id)} className="text-rose-500 shrink-0">
                            <Heart className="w-4.5 h-4.5 fill-rose-500" />
                          </button>
                        </div>
                        {/* Simulated sale badge on wishlist view */}
                        <div className="flex gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded">
                            {t('onSaleBadge')} -15%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-sm">${p.price.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => navigateTo('pdp', p.id)} className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          {p.stock > 0 && (
                            <button 
                              onClick={() => addToCart(p, 1, p.sizes[0], p.colors[0])}
                              className="px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> Buy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Your wishlist is currently empty.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Account Details */}
        {activeTab === 'details' && (
          <div className="max-w-xl">
            <form onSubmit={handleProfileUpdate} className="space-y-6 glass-card p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold">{t('editDetails')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl hover-scale active-scale transition-all"
              >
                {t('saveDetails')}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{t('addressTitle')}</h3>
              <button
                onClick={() => setAddressFormOpen(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold hover-scale active-scale transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> {t('addAddress')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className="p-6 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 dark:text-white">{addr.fullName}</h4>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Add Modal */}
            {addressFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div onClick={() => setAddressFormOpen(false)} className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
                
                <form 
                  onSubmit={handleAddressSubmit}
                  className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in"
                >
                  <h3 className="text-lg font-bold">New Shipping Address</h3>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Receiver Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                      className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      placeholder="Receiver name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Street</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      placeholder="Street name & number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        className="block w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="default-addr"
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                      className="h-4 w-4"
                    />
                    <label htmlFor="default-addr" className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                      Set as default shipping address
                    </label>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setAddressFormOpen(false)}
                      className="flex-grow py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-grow py-2.5 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
