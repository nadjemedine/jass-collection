import { useLanguage } from '@/context/LanguageContext';
import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const { t, dir } = useLanguage();

  const features = [
    {
      icon: Truck,
      title: t('التوصيل متوفر لكل الولايات', 'Livraison dans 58 wilayas'),
      desc: t('نصلك أينما كنت في أرجاء الوطن', 'Nous vous livrons partout dans le pays'),
    },
    {
      icon: ShieldCheck,
      title: t('نقودك في أمان - الدفع عند الاستلام', 'Paiement à la livraison'),
      desc: t('ادفع فقط عندما تستلم طلبيتك وتتأكد منها', 'Payez uniquement à la réception de votre commande'),
    },
    {
      icon: Zap,
      title: t('توصيل سريع', 'Livraison Rapide'),
      desc: t('معالجة وشحن طلبك في أسرع وقت ممكن', 'Traitement et expédition ultra rapides'),
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden" dir={dir}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-[#D4AF37]/30 hover:bg-white hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors duration-300">
                <feature.icon size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[250px]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
