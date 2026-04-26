import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist } from '@/context/WishlistContext';
import { client, queries } from '@/lib/sanity';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const { lang, t, dir } = useLanguage();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let allProducts: Product[] = [];
        try {
          allProducts = await client.fetch(queries.allProducts);
        } catch (e) {
          console.log('Sanity fetch failed');
        }

        if (!allProducts || allProducts.length === 0) {
          allProducts = getDemoProducts();
        }

        const wishlistProducts = allProducts.filter((p: Product) => wishlist.includes(p._id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Header />

      <main className="pt-[5.5rem] md:pt-[7rem] pb-20 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="px-4 py-4 border-b text-center">
          <h1 className="text-xl font-bold">
            {t('المفضلات', 'Favoris')}
          </h1>
          {wishlist.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {wishlist.length} {t('منتج', 'produit')}{wishlist.length !== 1 ? (lang === 'ar' ? 'ات' : 's') : ''}
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-[#FFF8E7] rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {t('لا توجد مفضلات', 'Aucun favori')}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              {t('أضف منتجاتك المفضلة بالضغط على أيقونة القلب', 'Ajoutez vos produits préférés en cliquant sur le cœur')}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#1A1A1A] hover:bg-[#333] px-8"
            >
              {t('تصفح المنتجات', 'Parcourir les produits')}
            </Button>
          </div>
        ) : (
          /* Wishlist Products */
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        )}
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
