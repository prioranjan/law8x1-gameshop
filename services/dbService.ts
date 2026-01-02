
import { Product, Order, OrderStatus, User } from '../types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Free Fire Diamonds',
    category: 'Mobile Gaming',
    price: 80,
    description: 'Direct top-up for Garena Free Fire. Instant delivery to your Player ID.',
    imageUrl: 'https://picsum.photos/seed/ff/400/400',
    inStock: true,
    variants: [
      { label: '100 Diamonds', price: 80 },
      { label: '310 Diamonds', price: 240 },
      { label: '520 Diamonds', price: 400 },
      { label: '1060 Diamonds', price: 800 }
    ]
  },
  {
    id: 'p2',
    name: 'PUBG Mobile UC',
    category: 'Mobile Gaming',
    price: 75,
    description: 'Unknown Cash for PUBG Mobile. Global or regional keys available.',
    imageUrl: 'https://picsum.photos/seed/pubg/400/400',
    inStock: true,
    variants: [
      { label: '60 UC', price: 75 },
      { label: '325 UC', price: 380 },
      { label: '660 UC', price: 750 }
    ]
  },
  {
    id: 'p3',
    name: 'Valorant Points',
    category: 'PC Gaming',
    price: 450,
    description: 'Valorant Points for skins, battle passes and more. Indian region supported.',
    imageUrl: 'https://picsum.photos/seed/valo/400/400',
    inStock: true,
    variants: [
      { label: '475 VP', price: 450 },
      { label: '1000 VP', price: 900 },
      { label: '2050 VP', price: 1800 }
    ]
  }
];

class DatabaseService {
  private products: Product[] = [];
  private orders: Order[] = [];
  private users: User[] = [];

  constructor() {
    const storedProducts = localStorage.getItem('l8x_products');
    const storedOrders = localStorage.getItem('l8x_orders');
    
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.products = INITIAL_PRODUCTS;
      this.saveProducts();
    }

    if (storedOrders) {
      this.orders = JSON.parse(storedOrders);
    }
  }

  private saveProducts() {
    localStorage.setItem('l8x_products', JSON.stringify(this.products));
  }

  private saveOrders() {
    localStorage.setItem('l8x_orders', JSON.stringify(this.orders));
  }

  // Product Operations
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = { ...product, id: Math.random().toString(36).substr(2, 9) };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    this.products = this.products.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveProducts();
  }

  async deleteProduct(id: string): Promise<void> {
    this.products = this.products.filter(p => p.id !== id);
    this.saveProducts();
  }

  // Order Operations
  async getOrders(): Promise<Order[]> {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      status: OrderStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    this.orders.push(newOrder);
    this.saveOrders();
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    this.orders = this.orders.map(o => o.id === orderId ? { ...o, status } : o);
    this.saveOrders();
  }
}

export const db = new DatabaseService();
