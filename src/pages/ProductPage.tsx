import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { client, queries } from '@/lib/sanity';
import type { Product } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, dir } = useLanguage();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let data = null;
        try {
          data = await client.fetch(queries.productBySlug, { slug });
        } catch (e) {
          console.log('Sanity fetch failed, using demo data');
        }

        if (!data) {
          // Find from demo data
          const allProducts = getDemoProducts();
          data = allProducts.find(p => p.slug?.current === slug || p._id === slug) || null;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Jass Collection',
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white" dir={dir}>
        <Header />
        <div className="pt-[5.5rem] md:pt-[7rem] pb-20">
          <Skeleton className="h-[50vh] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white" dir={dir}>
        <Header />
        <div className="pt-[5.5rem] md:pt-[7rem] pb-20 flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-500 text-lg">
              {t('المنتج غير موجود', 'Produit non trouvé')}
            </p>
            <Button onClick={() => navigate('/')} className="mt-4">
              {t('العودة للمتجر', 'Retour à la boutique')}
            </Button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const discount = product.discount || 0;
  const hasDiscount = discount > 0;
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Header />

      <main className="pt-[5.5rem] md:pt-[7rem] pb-20 max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-2 md:gap-8 md:pt-8 px-4 sm:px-6">
          {/* Image Gallery */}
          <div className="relative h-[55vh] md:h-[70vh] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.images?.[currentImageIndex] || '/placeholder.jpg'}
              alt={lang === 'ar' ? product.name : (product.nameFr || product.name)}
              className="w-full h-full object-cover"
            />

            {/* Navigation arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => Math.min((product.images?.length || 1) - 1, prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Top actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => toggleWishlist(product._id)}
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
              >
                <Heart size={18} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
              >
                <Share2 size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Dots */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentImageIndex ? 'bg-white w-5' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 md:mt-0 space-y-6"
          >
          {/* Name */}
          <h1 className="text-xl font-bold text-gray-900">
            {lang === 'ar' ? product.name : (product.nameFr || product.name)}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString()} {t('د.ج', 'DA')}
            </span>
            {hasDiscount && product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} {t('د.ج', 'DA')}
                </span>
                <span className="bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-2">
                {t('الألوان المتوفرة', 'Couleurs disponibles')}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1.5 bg-[#FFF8E7] rounded-full text-sm font-medium"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0
                  ? t(`متوفر (${product.stock} قطعة)`, `En stock (${product.stock})`)
                  : t('غير متوفر', 'Rupture de stock')
                }
              </span>
            </div>
          )}

          {/* Category */}
          {product.category && (
            <div className="text-sm text-gray-500">
              {t('الفئة:', 'Catégorie:')} {' '}
              <span className="font-medium text-gray-700">
                {lang === 'ar' ? product.category.name : product.category.name}
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={addedToCart || product.stock === 0}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all ${
              addedToCart
                ? 'bg-green-600 hover:bg-green-600'
                : 'bg-[#1A1A1A] hover:bg-[#333]'
            }`}
          >
            {addedToCart ? (
              <span className="flex items-center gap-2">
                ✓ {t('تمت الإضافة', 'Ajouté')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart size={20} />
                {t('أضف إلى السلة', 'Ajouter au panier')}
              </span>
            )}
          </Button>
        </motion.div>
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
      nameFr: 'Kimono blanc \u0026 noir',
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
