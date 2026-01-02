
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
  variants: { label: string; price: number }[];
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  variantLabel: string;
  amount: number;
  gameId: string;
  paymentMethod: 'UPI';
  paymentReference: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
