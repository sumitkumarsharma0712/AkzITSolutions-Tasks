# AuraShop - Premium E-Commerce Web Application

AuraShop is a modern, high-performance, and feature-rich E-Commerce single-page web application. It features a highly polished user experience, state-of-the-art styling with glassmorphism and micro-interactions, complete mobile-first responsiveness, dark mode, global state management via React Context, and a full shopping-to-checkout flow.

## 🚀 Features

- **Fluid User Authentication**:
  - **Sign Up**: Real-time password strength validation, Terms & Conditions verification.
  - **Login**: Input validation, "Remember Me" credential persistence, and "Forgot Password" mock flow.
- **Dynamic Storefront**:
  - Hero banner with promotional slider.
  - Category-based browsing and interactive "Trending Products" carousel.
- **Product Listing Page (PLP)**:
  - Sidebar filters for Price Range, Categories, and Ratings.
  - Dynamic sorting dropdown (Price: Low to High / High to Low, Newest, Rating).
  - Real-time product search.
- **Product Details Page (PDP)**:
  - Interactive multi-image gallery with zoom-on-hover effect.
  - Product specifications, stock indicators, and custom size/color variant selectors.
- **Cart & Multi-Step Checkout**:
  - Slide-out Cart Drawer showing subtotal, tax calculation, and discounts.
  - Multi-step Checkout Flow: Shipping Info ➡️ Payment Details ➡️ Order Confirmation.
- **User Dashboard**:
  - **Profile Management**: Edit name, email, avatar upload placeholder, and add/modify saved shipping addresses.
  - **Order History**: Track past orders, purchase date, total cost, and delivery status.
  - **Notifications Center**: Centralized notifications hub with read/unread visual markers and clear-all capabilities.
- **Advanced UX Elements**:
  - Real-time custom Toast Notifications for user actions (cart updates, updates to profile, etc.).
  - Responsive Skeleton Loaders for mock database queries.
  - Empty-state graphics for empty cart and search results.
  - Universal Dark/Light Mode system.
  - Full keyboard navigability & accessibility (a11y) considerations.

---

## 🛠️ Tech Stack

- **Core**: React.js 18+ (Vite)
- **Styling**: Tailwind CSS v3 & PostCSS
- **Icons**: Lucide React
- **State Management**: React Context API (Global App State)
- **Routing**: Component-driven SPA view router (Internal state-based navigation for maximum speed and simplicity)

---

## 📦 Folder Structure

```
E Commerce Project- AkzITSolutions/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and styles
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Navbar, Footer, Toast, Skeleton, EmptyState
│   │   └── storefront/     # Hero, CategoryGrid, ProductCard
│   ├── context/            # React Context (AppContext)
│   ├── data/               # Mock data (mockProducts, defaultNotifications)
│   ├── pages/              # Page level views
│   │   ├── Auth/           # Login, SignUp
│   │   ├── Checkout/       # CartDrawer, CheckoutFlow
│   │   ├── Dashboard/      # Profile, Notifications
│   │   └── Storefront/     # Home, PLP, PDP
│   ├── App.jsx             # Main Router and entry layout
│   ├── index.css           # Global CSS variables & Tailwind directives
│   └── main.jsx            # React mounting file
├── postcss.config.js       # PostCSS config
├── tailwind.config.js      # Tailwind CSS config
└── package.json            # Dependencies and scripts
```

---

## 💻 Setup & Installation Guide

Follow these steps to run AuraShop locally:

### 1. Clone the Repository
```bash
git clone https://github.com/sumitkumarsharma0712/AkzITSolutions-Tasks.git
cd "E Commerce Project- AkzITSolutions"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The application will run locally at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
This generates the optimized, production-ready assets inside the `dist` folder.
