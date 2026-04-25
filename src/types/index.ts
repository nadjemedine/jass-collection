export interface Product {
  _id: string;
  name: string;
  nameFr: string;
  slug: { current: string };
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category?: { name: string; slug: { current: string } };
  isNew: boolean;
  colors?: string[];
  stock?: number;
}

export interface Category {
  _id: string;
  name: string;
  nameFr: string;
  slug: { current: string };
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'ar' | 'fr';
