import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { client, queries } from '@/lib/sanity';
import type { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, dir } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        let productsData = null;
        let categoryData = null;

        try {
          productsData = await client.fetch(queries.productsByCategory, { slug });
          const categories = await client.fetch(queries.allCategories);
          categoryData = categories.find((c: Category) => c.slug.current === slug);
        } catch (e) {
          console.log('Sanity fetch failed');
        }

        if (!productsData || productsData.length === 0) {
          const allProducts = getDemoProducts();
          productsData = allProducts.filter((p: Product) => p.category?.slug.current === slug);
        }

        if (!categoryData) {
          const catNames: Record<string, { ar: string; fr: string }> = {
            dresses: { ar: 'فساتين', fr: 'Robes' },
            abayas: { ar: 'عبايات', fr: 'Abayas' },
            ensembles: { ar: 'أطقم', fr: 'Ensembles' },
            accessories: { ar: 'إكسسوارات', fr: 'Accessoires' },
          };
          const catInfo = catNames[slug] || { ar: slug, fr: slug };
          categoryData = {
            _id: slug,
            name: catInfo.ar,
            nameFr: catInfo.fr,
            slug: { current: slug },
          };
        }

        setProducts(productsData);
        setCategory(categoryData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

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
        <div className="px-4 py-4 border-b flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="flex-shrink-0"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">
              {lang === 'ar' ? category?.name : (category?.nameFr || category?.name)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} {t('منتج', 'produit')}{products.length !== 1 ? (lang === 'ar' ? 'ات' : 's') : ''}
            </p>
          </div>
          <div className="w-10" />
        </div>

        {/* Products Grid */}
        <div className="px-4 py-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('لا توجد منتجات في هذه الفئة', 'Aucun produit dans cette catégorie')}
              </p>
              <Button onClick={() => navigate('/')} className="mt-4 bg-[#1A1A1A]">
                {t('العودة للمتجر', 'Retour à la boutique')}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Features />
      <Footer />
      <BottomNav />
    </div>
  );
}

function getDemoProducts(): Product[] {
  return [
    {
      _id: '1', name: 'فستان حريري بيج', nameFr: 'Robe en soie beige',
      slug: { current: 'robe-soie-beige' }, description: 'فستان أنيق',
      price: 2800, originalPrice: 3200, discount: 12,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true, colors: ['Beige'], stock: 10,
    },
    {
      _id: '2', name: 'عباية كوين سوداء', nameFr: 'Abaya Queen noire',
      slug: { current: 'abaya-queen-noir' }, description: 'عباية فاخرة',
      price: 5600,
      images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&h=800&fit=crop'],
      category: { name: 'عبايات', slug: { current: 'abayas' } },
      isNew: true, colors: ['Noir'], stock: 5,
    },
    {
      _id: '3', name: 'كيمونو أبيض وأسود', nameFr: 'Kimono blanc \u0026 noir',
      slug: { current: 'kimono-blanc-noir' }, description: 'كيمونو أنيق',
      price: 1000,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false, colors: ['Blanc/Noir'], stock: 15,
    },
    {
      _id: '4', name: 'روب فوشيا', nameFr: 'Robe fuchsia',
      slug: { current: 'robe-fuchsia' }, description: 'روب فوشيا',
      price: 1500,
      images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true, colors: ['Fuchsia'], stock: 8,
    },
    {
      _id: '5', name: 'روب كيمونو عنابي', nameFr: 'Robe + Kimono cerise',
      slug: { current: 'robe-kimono-cerise' }, description: 'طقم روب وكيمونو',
      price: 3500,
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false, colors: ['Cerise'], stock: 6,
    },
    {
      _id: '6', name: 'روب بابيون وردي', nameFr: 'Robe papillon rose',
      slug: { current: 'robe-papillon-rose' }, description: 'روب بابيون',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: false, colors: ['Rose'], stock: 12,
    },
    {
      _id: '7', name: 'فستان دانتيل أزرق', nameFr: 'Robe en dentelle bleue',
      slug: { current: 'robe-dentelle-bleu' }, description: 'فستان دانتيل',
      price: 3800,
      images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true, colors: ['Bleu'], stock: 7,
    },
    {
      _id: '8', name: 'أطقم جينز كاجوال', nameFr: "Ensemble jean's casual",
      slug: { current: 'ensemble-jeans-casual' }, description: 'طقم جينز',
      price: 4900, originalPrice: 7500, discount: 35,
      images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop'],
      category: { name: 'أطقم', slug: { current: 'ensembles' } },
      isNew: false, colors: ['Bleu'], stock: 4,
    },
    {
      _id: '11', name: 'فستان قميص زيتوني', nameFr: 'Robe chemise olive',
      slug: { current: 'robe-chemise-olive' }, description: 'فستان قميص',
      price: 2800,
      images: ['https://images.unsplash.com/photo-1550614000-4b9519e02a48?w=600&h=800&fit=crop'],
      category: { name: 'فساتين', slug: { current: 'dresses' } },
      isNew: true, colors: ['Vert olive'], stock: 8,
    },
    {
      _id: '12', name: 'عباية روزيت أزرق', nameFr: 'Abaya rosette bleue',
      slug: { current: 'abaya-rosette-bleu' }, description: 'عباية روزيت',
      price: 3900,
      images: ['https://images.unsplash.com/photo-1618886614638-80e3c103d2dc?w=600&h=800&fit=crop'],
      category: { name: 'عبايات', slug: { current: 'abayas' } },
      isNew: false, colors: ['Bleu ciel'], stock: 6,
    },
  ];
}
