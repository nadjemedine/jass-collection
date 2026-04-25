import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductStackProps {
  products: Product[];
}

export default function ProductStack({ products }: ProductStackProps) {
  const [index, setIndex] = useState(0);

  const handleSwipe = () => {
    setIndex((prev) => (prev + 1) % products.length);
  };

  if (!products.length) return null;

  // We show up to 5 cards in the stack
  const stackItems = [];
  for (let i = 4; i >= 0; i--) {
    const itemIndex = (index + i) % products.length;
    if (products[itemIndex]) {
      stackItems.push({
        product: products[itemIndex],
        isTop: i === 0,
        depth: i
      });
    }
  }

  return (
    <div className="relative h-[420px] w-full max-w-[300px] mx-auto mt-4 mb-20">
      <AnimatePresence initial={false}>
        {stackItems.map((item) => (
          item.isTop ? (
            <SwipableCard
              key={item.product._id}
              product={item.product}
              onSwipe={handleSwipe}
            />
          ) : (
            <motion.div
              key={item.product._id + '-back-' + item.depth}
              className="absolute inset-0"
              style={{ zIndex: 0 }}
              initial={{ 
                scale: 0.8 - item.depth * 0.05, 
                opacity: 0,
                y: item.depth * 18,
                x: item.depth % 2 === 0 ? 25 : -25,
                rotate: item.depth % 2 === 0 ? 12 : -12
              }}
              animate={{ 
                scale: 0.95 - (item.depth - 1) * 0.05, 
                opacity: 0.7 - (item.depth - 1) * 0.15,
                y: [(item.depth - 1) * 18, (item.depth - 1) * 18 - 5, (item.depth - 1) * 18],
                x: (item.depth - 1) % 2 === 0 ? 15 : -15,
                rotate: (item.depth - 1) % 2 === 0 ? 12 : -12
              }}
              transition={{ 
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.depth * 0.2
                },
                duration: 0.3 
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="pointer-events-none grayscale-[0.1]">
                <ProductCard product={item.product} />
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}

interface SwipableCardProps {
  product: Product;
  onSwipe: () => void;
}

function SwipableCard({ product, onSwipe }: SwipableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          onSwipe();
        }
      }}
      initial={{ scale: 1, opacity: 1, x: 0 }}
      animate={{ scale: 1, opacity: 1, x: 0, y: [0, -5, 0] }}
      transition={{ 
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        },
        duration: 0.3 
      }}
      exit={{ 
        x: x.get() > 0 ? 500 : -500, 
        opacity: 0, 
        rotate: x.get() > 0 ? 45 : -45,
        transition: { duration: 0.4 } 
      }}
      whileHover={{ scale: 1.05 }}
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
    >
      <ProductCard product={product} />
      
      {/* Hint overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
          <span className="text-white text-2xl">←</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
          <span className="text-white text-2xl">→</span>
        </div>
      </div>
    </motion.div>
  );
}
