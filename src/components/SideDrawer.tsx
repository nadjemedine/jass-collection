import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Category } from '@/types';
import { client, queries } from '@/lib/sanity';
import { Separator } from '@/components/ui/separator';

interface SideDrawerProps {
  onClose: () => void;
}

export default function SideDrawer({ onClose }: SideDrawerProps) {
  const { lang, t, setLang, dir } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'store' | 'settings'>('store');


  useEffect(() => {
    client.fetch(queries.allCategories).then((data) => {
      if (data) setCategories(data);
    }).catch(console.error);
  }, []);

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
    onClose();
  };


  return (
    <div className="flex flex-col h-full" dir={dir}>
      {/* Header Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'store' 
              ? 'border-[#D4AF37] text-black bg-gray-50/50' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {t('المتجر', 'Boutique')}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'settings' 
              ? 'border-[#D4AF37] text-black bg-gray-50/50' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          {t('الإعدادات', 'Réglages')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'store' ? (
          /* Store Tab Content */
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                {t('الفئات', 'Catégories')}
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat.slug.current)}
                    className="w-full text-right py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium border border-transparent hover:border-gray-200"
                  >
                    {lang === 'ar' ? cat.name : (cat.nameFr || cat.name)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                {t('المجموعات', 'Collections')}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => { navigate('/discounts'); onClose(); }}
                  className="w-full text-right py-3 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100"
                >
                  {t('تخفيضات الربيع', 'Soldes de Printemps')}
                </button>
                <button 
                  onClick={() => { navigate('/'); onClose(); }}
                  className="w-full text-right py-3 px-4 rounded-xl bg-black text-white text-sm font-medium"
                >
                  {t('وصلنا حديثاً', 'Nouveauté')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Settings Tab Content */
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            {/* Language Switcher */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-4 flex items-center gap-2">
                 {t('اختر اللغة', 'Choisir la langue')}
              </h3>
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => setLang('ar')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    lang === 'ar' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setLang('fr')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    lang === 'fr' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Français
                </button>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-4">
                {t('تواصل معنا', 'Contactez-nous')}
              </h3>
              <a 
                href="tel:+213123456789"
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border group hover:bg-white transition-all active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{t('اتصل بنا', 'Appelez-nous')}</p>
                  <p className="font-bold text-sm tracking-widest">+213 123 456 789</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
