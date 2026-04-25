import { Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { WishlistProvider } from '@/context/WishlistContext';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import DiscountsPage from '@/pages/DiscountsPage';
import CategoryPage from '@/pages/CategoryPage';
import WishlistPage from '@/pages/WishlistPage';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/discounts" element={<DiscountsPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
