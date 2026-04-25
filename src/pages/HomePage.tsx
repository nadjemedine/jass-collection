import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { client, queries } from '@/lib/sanity';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import ProductStack from '@/components/ProductStack';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

// Demo images for hero slider
const heroImages = [
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop',
];

export default function HomePage() {
  const { lang, t, dir } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchQuery = searchParams.get('search') || '';

  // Fetch products
  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        // Try fetching from Sanity first
        let allProducts: Product[] = [];
        try {
          allProducts = await client.fetch(queries.allProducts);
        } catch (e) {
          console.log('Sanity fetch failed, using demo data');
        }

        if (!allProducts || allProducts.length === 0) {
          // Use demo data
          allProducts = getDemoProducts();
        }

        if (searchQuery) {
          const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.nameFr && p.nameFr.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setProducts(filtered);
        } else {
          setProducts(allProducts);
        }

        setNewProducts(allProducts.filter((p: Product) => p.isNew));
        setDiscountedProducts(allProducts.filter((p: Product) => (p.discount || 0) > 0));
      } catch (error) {
        console.error('Error fetching products:', error);
        const demo = getDemoProducts();
        setProducts(demo);
        setNewProducts(demo.filter((p: Product) => p.isNew));
        setDiscountedProducts(demo.filter((p: Product) => (p.discount || 0) > 0));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Hero slider auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchParams(query ? { search: query } : {});
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white" dir={dir}>
        <Header />
        <div className="pt-[5.5rem] md:pt-[7rem] pb-20 px-4">
          <Skeleton className="h-[50vh] w-full rounded-2xl mb-6" />
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
      <Header onSearch={handleSearch} />

      <main className="pt-[5.5rem] md:pt-[7rem] pb-20 max-w-7xl mx-auto">
        {/* Hero Slider */}
        {!searchQuery && (
          <section className="relative h-[75vh] overflow-hidden">
            {heroImages.map((img, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  opacity: i === heroIndex ? 1 : 0,
                  scale: i === heroIndex ? 1 : 1.05,
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img
                  src={img}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>
            ))}

            {/* Logo overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
              <h2 className="text-2xl font-bold tracking-wider">Jass Collection</h2>
              <p className="text-sm opacity-90 mt-1">
                {t('أناقة وتميز', 'Élégance & Distinction')}
              </p>
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === heroIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Search results header */}
        {searchQuery && (
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold">
              {t('نتائج البحث:', 'Résultats de recherche:')} &quot;{searchQuery}&quot;
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} {t('منتج', 'produit')}{products.length !== 1 ? (lang === 'ar' ? 'ات' : 's') : ''}
            </p>
          </div>
        )}

        {/* New Products Section */}
        {!searchQuery && newProducts.length > 0 && (
          <section className="px-4 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-lg font-semibold whitespace-nowrap flex items-center gap-1">
                ✨ {t('جديد جاس كوليكشن', 'Nouveautés Jass Collection')} ✨
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 px-1 no-scrollbar -mx-4 px-4 scroll-smooth">
              {newProducts.map((product, i) => (
                <div key={product._id} className="w-[160px] sm:w-[200px] flex-shrink-0">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        {!searchQuery && (
          <section className="px-4 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-lg font-semibold whitespace-nowrap">
                {t('جميع المنتجات', 'Tous les produits')}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </section>
        )}

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
                {t('لا توجد منتجات', 'Aucun produit trouvé')}
              </p>
            </div>
          )}
        </div>

        {/* Discounted Products Section */}
        {!searchQuery && discountedProducts.length > 0 && (
          <section className="px-4 py-6 mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-lg font-semibold whitespace-nowrap flex items-center gap-1">
                ✨ {t('تخفيضات جاس كوليكشن', 'Promotions Jass Collection')} ✨
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="mt-4">
              <ProductStack products={discountedProducts} />
            </div>
          </section>
        )}

      </main>
      <Footer />

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 left-4 z-40 w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}

      <BottomNav />
    </div>
  );
}

function getDemoProducts(): Product[] {
  return [
    {
      _id: '1',
      name: 'فستان حريري بيج',
      nameFr: 'Robe en soie beige',
      slug: { current: 'robe-soie-beige' },
      description: 'فستان أنيق من الحرير الطبيعي بلون بيج فاتح',
      price: 2800,
      originalPrice: 3200,
      discount: 12,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true,
      colors: ['Beige'],
      stock: 10,
    },
    {
      _id: '2',
      name: 'عباية كوين سوداء',
      nameFr: 'Abaya Queen noire',
      slug: { current: 'abaya-queen-noir' },
      description: 'عباية فاخرة بلون أسود أنيق',
      price: 5600,
      images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop'],
      category: { name: 'عبايات', slug: { current: 'abayas' } },
      isNew: true,
      colors: ['Noir'],
      stock: 5,
    },
    {
      _id: '3',
      name: 'كيمونو أبيض وأسود',
      nameFr: 'Kimono blanc & noir',
      slug: { current: 'kimono-blanc-noir' },
      description: 'كيمونو أنيق بتصميم عصري',
      price: 1000,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false,
      colors: ['Blanc/Noir'],
      stock: 15,
    },
    {
      _id: '4',
      name: 'روب فوشيا',
      nameFr: 'Robe fuchsia',
      slug: { current: 'robe-fuchsia' },
      description: 'روب أنيق بلون فوشيا زاهي',
      price: 1500,
      images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true,
      colors: ['Fuchsia'],
      stock: 8,
    },
    {
      _id: '5',
      name: 'روب كيمونو عنابي',
      nameFr: 'Robe + Kimono cerise',
      slug: { current: 'robe-kimono-cerise' },
      description: 'طقم روب وكيمونو بلون عنابي غامق',
      price: 3500,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false,
      colors: ['Cerise'],
      stock: 6,
    },
    {
      _id: '6',
      name: 'روب بابيون وردي',
      nameFr: 'Robe papillon rose',
      slug: { current: 'robe-papillon-rose' },
      description: 'روب بتصميم فراشة أنيق',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false,
      colors: ['Rose'],
      stock: 12,
    },
    {
      _id: '7',
      name: 'فستان دانتيل أزرق',
      nameFr: 'Robe en dentelle bleue',
      slug: { current: 'robe-dentelle-bleu' },
      description: 'فستان فاخر من الدانتيل الأزرق',
      price: 3800,
      images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true,
      colors: ['Bleu'],
      stock: 7,
    },
    {
      _id: '8',
      name: 'أطقم جينز كاجوال',
      nameFr: "Ensemble jean's casual",
      slug: { current: 'ensemble-jeans-casual' },
      description: 'طقم جينز كاجوال أنيق ومريح',
      price: 4900,
      originalPrice: 7500,
      discount: 35,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false,
      colors: ['Bleu'],
      stock: 4,
    },
    {
      _id: '9',
      name: 'فيست جينز بورجوندي',
      nameFr: 'Veste jeans bordeaux',
      slug: { current: 'veste-jeans-bordeaux' },
      description: 'فيست جينز أنيق بلون بورجوندي',
      price: 2900,
      originalPrice: 3500,
      discount: 17,
      images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false,
      colors: ['Bordeaux'],
      stock: 9,
    },
    {
      _id: '10',
      name: 'روب بيج فاتح',
      nameFr: 'Robe beige clair',
      slug: { current: 'robe-beige-clair' },
      description: 'روب أنيق بلون بيج فاتح ناعم',
      price: 1900,
      originalPrice: 2900,
      discount: 34,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false,
      colors: ['Beige'],
      stock: 11,
    },
    {
      _id: '11',
      name: 'فستان قميص زيتوني',
      nameFr: 'Robe chemise olive',
      slug: { current: 'robe-chemise-olive' },
      description: 'فستان قميص أنيق بلون زيتوني',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true,
      colors: ['Vert olive'],
      stock: 8,
    },
    {
      _id: '12',
      name: 'عباية روزيت أزرق',
      nameFr: 'Abaya rosette bleue',
      slug: { current: 'abaya-rosette-bleu' },
      description: 'عباية روزيت فاخرة بلون أزرق سماوي',
      price: 3900,
      images: ['https://images.unsplash.com/photo-1618886614638-80e3c103d2dc?w=600&h=800&fit=crop'],
      category: { name: 'عبايات', slug: { current: 'abayas' } },
      isNew: false,
      colors: ['Bleu ciel'],
      stock: 6,
    },
  ];
}
