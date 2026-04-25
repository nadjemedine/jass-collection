import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Product } from '@/types';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(product._id);

  const discount = product.discount || 0;
  const hasDiscount = discount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-[#FFF8E7] rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
      onClick={() => navigate(`/product/${product.slug?.current || product._id}`)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={lang === 'ar' ? product.name : (product.nameFr || product.name)}
          className="w-full h-full object-cover"
        />
        
        {/* Color badge */}
        {product.colors && product.colors.length > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {product.colors[0]}
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* New badge */}
        {product.isNew && !hasDiscount && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('جديد', 'Nouveau')}
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product._id);
            }}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              size={18}
              className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <ShoppingCart size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {lang === 'ar' ? product.name : (product.nameFr || product.name)}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-base text-gray-900">
            {product.price.toLocaleString()} {t('د.ج', 'DA')}
          </span>
          {hasDiscount && product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString()} {t('د.ج', 'DA')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
