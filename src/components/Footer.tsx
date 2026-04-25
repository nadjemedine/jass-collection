import { useLanguage } from '@/context/LanguageContext';
import { Instagram, Facebook, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1A1A1A] text-white pt-16 pb-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
        
        {/* Brand Logo Section */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase">
            <span className="text-[#D4AF37]">J</span>ass <span className="text-[#D4AF37]">C</span>ollection
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto" />
          <p className="max-w-md text-gray-400 text-sm leading-relaxed italic">
            {t(
              'نقدم لكِ أرقى الأزياء والعبايات العصرية المصممة بعناية لتناسب أناقتكِ وتميزكِ في كل المناسبات.',
              'Nous vous proposons les vêtements et abayas les plus raffinés, conçus avec soin pour sublimer votre élégance et votre distinction.'
            )}
          </p>
        </div>

        {/* Quick Links / Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-t border-white/5 pt-12">
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{t('المتجر', 'Boutique')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">{t('الرئيسية', 'Accueil')}</a></li>
              <li><a href="/discounts" className="hover:text-white transition-colors">{t('التخفيضات', 'Promotions')}</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">{t('السلة', 'Panier')}</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{t('الفئات', 'Catégories')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/category/dresses" className="hover:text-white transition-colors">{t('فساتين', 'Robes')}</a></li>
              <li><a href="/category/abayas" className="hover:text-white transition-colors">{t('عبايات', 'Abayas')}</a></li>
              <li><a href="/category/ensembles" className="hover:text-white transition-colors">{t('أطقم', 'Ensembles')}</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{t('تواصل معنا', 'Contact')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center justify-center gap-2">
                <Phone size={14} className="text-[#D4AF37]" />
                <span dir="ltr">+213 123 456 789</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <Mail size={14} className="text-[#D4AF37]" />
                <span>contact@jass-collection.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{t('تابعونا', 'Suivez-nous')}</h3>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all">
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-gray-500">
          <p>© 2026 Jass Collection. {t('جميع الحقوق محفوظة', 'Tous droits réservés')}.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">{t('سياسة الخصوصية', 'Confidentialité')}</a>
            <a href="https://developpement.online" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
              {t('تم انشاءئه من قبل Developpement.online', 'Propulsé par Developpement.online')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
