import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, Search, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import SideDrawer from './SideDrawer';
import CartDrawer from './CartDrawer';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { t, dir } = useLanguage();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Ticker Bar */}
      <div className="bg-white h-8 overflow-hidden flex items-center border-b border-gray-200 w-full relative">
        <div className="whitespace-nowrap animate-ticker inline-block min-w-full text-center">
          {dir === 'rtl' ? (
            <span className="text-black font-bold text-sm px-4 inline-block">
              مرحبا في متجر Jass Collection &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; التوصيل متوفر لجميع الولايات &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; الدفع عند الاستلام
            </span>
          ) : (
            <span className="text-black font-bold text-sm px-4 inline-block">
              Bienvenue sur la boutique Jass Collection. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Livraison disponible dans tous les États. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Paiement à la livraison.
            </span>
          )}
        </div>
      </div>
      
      {/* Main Header */}
      <div className="bg-[#1A1A1A] h-14 md:h-20 max-w-7xl mx-auto flex items-center justify-between px-4 relative w-full">
        {/* Search + Menu */}
        <div className="flex items-center gap-3">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button className="text-white hover:opacity-80 transition-opacity">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="w-[85vw] sm:w-[350px] p-0">
              <SideDrawer onClose={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:opacity-80 transition-opacity"
          >
            {searchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
        </div>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2 group">
          <h1 className="text-white font-bold text-base md:text-xl tracking-[0.15em] uppercase transition-all duration-300 group-hover:scale-102">
            <span className="text-[#D4AF37]">J</span>ass <span className="text-[#D4AF37]">C</span>ollection
          </h1>
          <div className="h-[1px] w-0 group-hover:w-full bg-[#D4AF37] transition-all duration-500 mx-auto" />
        </a>

        {/* Cart Drawer */}
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <button className="relative">
              <ShoppingCart size={22} className="text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side={dir === 'rtl' ? 'left' : 'right'} className="w-[85vw] sm:w-[350px] p-0">
            <CartDrawer onClose={() => setCartOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute top-[5.5rem] md:top-[7rem] left-0 right-0 bg-white shadow-md p-3 z-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={t('ابحث عن منتج...', 'Rechercher un produit...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-right"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#1A1A1A] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
