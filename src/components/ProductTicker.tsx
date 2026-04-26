import { motion } from 'framer-motion';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductTickerProps {
  products: Product[];
}

export default function ProductTicker({ products }: ProductTickerProps) {
  if (!products || products.length === 0) return null;

  // Double the products for a seamless loop
  const doubledProducts = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-gray-50/50">
      <motion.div
        className="flex gap-4 px-4"
        animate={{
          x: [0, "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: products.length * 6, // Adjusted speed: 6s per product
            ease: "linear",
          },
        }}
        style={{ width: "fit-content" }}
      >
        {doubledProducts.map((product, index) => (
          <div 
            key={`${product._id}-${index}`} 
            className="w-[180px] sm:w-[240px] md:w-[280px] flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
      
      {/* Gradient Overlays for a smoother look */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}
