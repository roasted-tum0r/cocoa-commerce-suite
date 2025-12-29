export interface HomeState {
  categories: { items: CategoryList[]; pagination: paginationType };
  latestProducts: { items: any[]; pagination: paginationType };
  totalProducts: number;
  totalCustomers: number;
  totalRatings: number;
  totalSatisfiedCustomers: number;
  cartItems: { items: any[]; pagination: paginationType };
  notifications: { items: any[]; pagination: paginationType };
  wishListItems: { items: any[]; pagination: paginationType };
  loading?: boolean;
  error?: string | null;
  lastPath?: string;
}

export interface CategoryList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    items: number;
  };
}
export interface paginationType {
  loading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  sortBy?: string;
  isAsc?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Review {
  id?: string;
  rating?: number;
  comment?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  categoryId: string;
  images: string[]; // adjust if backend sends array of objects later
  reviews: Review[];
  rating: number;
  isAvailable: boolean;
  price: number;
  image: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  onIncrement?: (productId: string) => void;
  onDecrement?: (productId: string) => void;
}

export interface ProductsListProps extends Partial<ProductCardProps> {
  title?: string;
}

export interface FetchLatestProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAsc?: boolean;
  isAvailable?: boolean;
  categoryIds?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CartItem {
  itemId: string;
  quantity: number;
}

export interface CartState {
  cartId: string | null;
  guestUserId: string | null;
  items: any[];
  cartInfo: CartItem[] | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
}

export interface AuthState {
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    firstname: string;
    lastname: string;
    createdAt: string;
  } | null;
  loading: boolean;
  error: string | null;
  hashKey: string | null;
  identifier: string | null;
}
