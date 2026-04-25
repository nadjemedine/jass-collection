import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Store, ShoppingCart, Tag, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: Store, label: t('المتجر', 'Boutique') },
    { path: '/wishlist', icon: Heart, label: t('المفضلة', 'Favoris') },
    { path: '/discounts', icon: Tag, label: t('التخفيضات', 'Promos') },
    { path: '/cart', icon: ShoppingCart, label: t('السلة', 'Panier') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] h-16 pb-safe flex items-center justify-around md:hidden rounded-t-[40px] shadow-[0_-8px_20px_rgba(0,0,0,0.2)]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 relative ${
              isActive ? 'text-white' : 'text-white/60'
            } hover:text-white transition-colors`}
          >
            <motion.div 
              className="relative"
              whileTap={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon size={22} />
              {tab.path === '/cart' && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              {tab.path === '/wishlist' && wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </motion.div>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
