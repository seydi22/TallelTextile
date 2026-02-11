export interface Product {
  id: string | number;
  slug: string;
  title: string;
  mainImage: string;
  price: number;
  rating: number;
  description: string;
  manufacturer: string;
  inStock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}
