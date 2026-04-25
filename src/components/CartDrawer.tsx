import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { lang, t, dir } = useLanguage();
  const { state, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white" dir={dir}>
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center justify-center relative">
        <h2 className="text-lg font-bold">
          {t('سلة التسوق', 'Panier')}
        </h2>
        {totalItems > 0 && (
          <span className="mr-2 text-xs text-gray-500">
            ({totalItems})
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 bg-[#FFF8E7] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              {t('السلة فارغة', 'Votre panier est vide')}
            </h3>
            <Button
              onClick={() => {
                navigate('/');
                onClose();
              }}
              variant="outline"
              className="mt-4"
            >
              {t('تصفح المنتجات', 'Parcourir')}
            </Button>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#FFF8E7] rounded-xl p-3 flex gap-3"
                >
                  <div
                    className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${item.product.slug?.current || item.product._id}`);
                      onClose();
                    }}
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-xs font-medium truncate cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${item.product.slug?.current || item.product._id}`);
                        onClose();
                      }}
                    >
                      {lang === 'ar' ? item.product.name : (item.product.nameFr || item.product.name)}
                    </h3>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {item.product.price.toLocaleString()} {t('د.ج', 'DA')}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {state.items.length > 0 && (
        <div className="p-4 border-t bg-white space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{t('الإجمالي', 'Total')}</span>
            <span className="text-lg font-bold">{totalPrice.toLocaleString()} {t('د.ج', 'DA')}</span>
          </div>
          <Button
            onClick={() => {
              navigate('/checkout'); // Assuming there's a checkout page
              onClose();
            }}
            className="w-full h-12 bg-[#1A1A1A] hover:bg-[#333] rounded-xl text-white font-semibold"
          >
            {t('إتمام الطلب', 'Commander')}
          </Button>
          <button
            onClick={clearCart}
            className="w-full text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            {t('إفراغ السلة', 'Vider le panier')}
          </button>
        </div>
      )}
    </div>
  );
}
