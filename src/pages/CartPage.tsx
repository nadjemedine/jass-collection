import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, ShoppingBag, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WILAYAS } from '@/lib/wilayas';

export default function CartPage() {
  const { lang, t, dir } = useLanguage();
  const { state, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    deliveryType: 'home', // 'home' or 'office'
    deliveryAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Header />

      <main className="pt-[5.5rem] md:pt-[7rem] pb-20">
        {/* Page Title */}
        <div className="px-4 py-4 border-b">
          <h1 className="text-xl font-bold text-center">
            {t('سلة التسوق', 'Panier')}
          </h1>
          {totalItems > 0 && (
            <p className="text-center text-sm text-gray-500 mt-1">
              {totalItems} {t('منتج', 'produit')}{totalItems !== 1 ? (lang === 'ar' ? 'ات' : 's') : ''}
            </p>
          )}
        </div>

        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-[#FFF8E7] rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {t('السلة فارغة', 'Votre panier est vide')}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              {t('ابدأ التسوق واكتشف منتجاتنا الرائعة', 'Commencez vos achats et découvrez nos produits')}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#1A1A1A] hover:bg-[#333] px-8"
            >
              {t('تصفح المنتجات', 'Parcourir les produits')}
            </Button>
          </div>
        ) : (
          /* Cart Items */
          <div className="px-4 py-4 space-y-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-[#FFF8E7] rounded-xl p-3 flex gap-3"
                >
                  {/* Image */}
                  <div
                    className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${item.product.slug?.current || item.product._id}`)}
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-sm font-medium truncate cursor-pointer"
                      onClick={() => navigate(`/product/${item.product.slug?.current || item.product._id}`)}
                    >
                      {lang === 'ar' ? item.product.name : (item.product.nameFr || item.product.name)}
                    </h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {item.product.price.toLocaleString()} {t('د.ج', 'DA')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString()} {t('د.ج', 'DA')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Separator />

            {/* Summary moved below form */}

            {/* COD Checkout Form */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-4 border mt-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <MapPin size={20} className="text-[#D4AF37]" />
                {t('معلومات التوصيل', 'Informations de livraison')}
              </h3>
              
              <div className="space-y-3">
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('الاسم الكامل', 'Nom complet')}
                  className="bg-white"
                />
                
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('رقم الهاتف', 'Numéro de téléphone')}
                  className="bg-white"
                  dir="ltr"
                  style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    name="wilaya"
                    value={formData.wilaya}
                    onChange={handleInputChange}
                    className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">{t('الولاية', 'Wilaya')}</option>
                    {WILAYAS.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.id} - {lang === 'ar' ? w.nameAr : w.nameFr}
                      </option>
                    ))}
                  </select>
                  
                  <Input
                    name="commune"
                    value={formData.commune}
                    onChange={handleInputChange}
                    placeholder={t('البلدية', 'Commune')}
                    className="bg-white"
                  />
                </div>

                {/* Delivery Type Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'home' }))}
                    className={`py-2 rounded-md text-xs font-medium transition-all ${formData.deliveryType === 'home' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {t('توصيل للمنزل', 'À domicile')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'office' }))}
                    className={`py-2 rounded-md text-xs font-medium transition-all ${formData.deliveryType === 'office' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {t('توصيل للمكتب', 'Au bureau')}
                  </button>
                </div>
              </div>
            </div>

            {/* Summary moved here */}
            <div className="bg-white p-4 rounded-xl space-y-2 border shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('المجموع', 'Sous-total')}</span>
                <span className="font-medium">{totalPrice.toLocaleString()} {t('د.ج', 'DA')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('التوصيل', 'Livraison')}</span>
                <span className="text-green-600 font-medium">{t('مجاني', 'Gratuit')}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t('الإجمالي', 'Total')}</span>
                <span>{totalPrice.toLocaleString()} {t('د.ج', 'DA')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full h-14 text-base font-semibold bg-[#1A1A1A] hover:bg-[#333] rounded-xl mt-4"
              onClick={() => {
                if(!formData.fullName || !formData.phone || !formData.wilaya || !formData.commune) {
                  alert(t('الرجاء ملء جميع المعلومات', 'Veuillez remplir toutes les informations'));
                  return;
                }
                alert(t('تم استلام طلبك بنجاح وسيتصل بك فريقنا قريباً لتأكيد الطلبية.', 'Votre commande a été reçue avec succès et notre équipe vous contactera sous peu.'));
                clearCart();
                navigate('/');
              }}
            >
              {t('تأكيد الطلب', 'Confirmer la commande')}
            </Button>

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full h-10 text-sm"
            >
              {t('إفراغ السلة', 'Vider le panier')}
            </Button>
          </div>
        )}
      </main>
      {state.items.length > 0 && <Footer />}
      <BottomNav />
    </div>
  );
}
