import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { client, queries } from '@/lib/sanity';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export default function DiscountsPage() {
  const { t, dir } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data = null;
        try {
          data = await client.fetch(queries.discountedProducts);
        } catch (e) {
          console.log('Sanity fetch failed');
        }

        if (!data || data.length === 0) {
          const allProducts = getDemoProducts();
          data = allProducts.filter((p: Product) => (p.discount || 0) > 0);
        }

        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
        const demo = getDemoProducts();
        setProducts(demo.filter((p: Product) => (p.discount || 0) > 0));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" dir={dir}>
        <Header />
        <div className="pt-[5.5rem] md:pt-[7rem] pb-20 px-4">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Header />

      <main className="pt-[5.5rem] md:pt-[7rem] pb-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-4 py-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Tag size={28} className="text-red-600" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">
            ✨ {t('تخفيضات جاس كوليكشن', 'Promotions Jass Collection')} ✨
          </h1>
          <p className="text-gray-500 text-sm">
            {t('أفضل العروض والتخفيضات الحصرية', 'Meilleures offres et promotions exclusives')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="px-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('لا توجد تخفيضات حالياً', 'Aucune promotion en ce moment')}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

function getDemoProducts(): Product[] {
  return [
    {
      _id: '1', name: 'فستان حريري بيج', nameFr: 'Robe en soie beige',
      slug: { current: 'robe-soie-beige' }, description: 'فستان أنيق من الحرير الطبيعي',
      price: 2800, originalPrice: 3200, discount: 12,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true, colors: ['Beige'], stock: 10,
    },
    {
      _id: '2', name: 'عباية كوين سوداء', nameFr: 'Abaya Queen noire',
      slug: { current: 'abaya-queen-noir' }, description: 'عباية فاخرة',
      price: 5600, images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop'],
      category: { name: 'عبايات', slug: { current: 'abayas' } },
      isNew: true, colors: ['Noir'], stock: 5,
    },
    {
      _id: '8', name: 'أطقم جينز كاجوال', nameFr: "Ensemble jean's casual",
      slug: { current: 'ensemble-jeans-casual' }, description: 'طقم جينز كاجوال',
      price: 4900, originalPrice: 7500, discount: 35,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false, colors: ['Bleu'], stock: 4,
    },
    {
      _id: '9', name: 'فيست جينز بورجوندي', nameFr: 'Veste jeans bordeaux',
      slug: { current: 'veste-jeans-bordeaux' }, description: 'فيست جينز',
      price: 2900, originalPrice: 3500, discount: 17,
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false, colors: ['Bordeaux'], stock: 9,
    },
    {
      _id: '10', name: 'روب بيج فاتح', nameFr: 'Robe beige clair',
      slug: { current: 'robe-beige-clair' }, description: 'روب بيج',
      price: 1900, originalPrice: 2900, discount: 34,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false, colors: ['Beige'], stock: 11,
    },
  ];
}
