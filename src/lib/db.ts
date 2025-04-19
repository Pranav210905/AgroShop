import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};



export type AdminUser = {
  id: string;
  email: string;
  role: 'admin';
  created_at: string;
};

export type OrderProduct = {
  productId: string;
  quantity: number;
  pricePerUnit: number;
};

export type Order = {
  id: string;
  userId: string;
  products: OrderProduct[]; // ← changed from single productId/quantity
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  created_at: string;
  updated_at: string;
  estimatedDelivery: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
};



// Products
export async function getProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const productsCollection = collection(db, 'products');
  const now = new Date().toISOString();
  const newProduct = {
    ...product,
    created_at: now,
    updated_at: now
  };
  const docRef = await addDoc(productsCollection, newProduct);
  return {
    id: docRef.id,
    ...newProduct
  };
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const productRef = doc(db, 'products', id);
  const updates = {
    ...product,
    updated_at: new Date().toISOString()
  };
  await updateDoc(productRef, updates);
  return {
    id,
    ...updates
  };
}

export async function deleteProduct(id: string) {
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
}

// Orders
export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'status' | 'currentLocation' | 'estimatedDelivery'>
) {
  const ordersCollection = collection(db, 'orders');
  const now = new Date().toISOString();
  const estimatedDelivery = new Date(Date.now() + 10 * 60000).toISOString(); // 10 min ETA

  const newOrder = {
    ...orderData,
    status: 'pending',
    created_at: now,
    updated_at: now,
    estimatedDelivery,
    currentLocation: {
      lat: 40.7128,
      lng: -74.0060
    }
  };

  const docRef = await addDoc(ordersCollection, newOrder);
  return {
    id: docRef.id,
    ...newOrder
  };
}


export async function getOrders(userId: string): Promise<Order[]> {
  const ordersCollection = collection(db, 'orders');
  const q = query(ordersCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Order));
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const orderRef = doc(db, 'orders', orderId);
  const snapshot = await getDoc(orderRef);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Order;
}

export async function updateOrderStatus(orderId: string, status: Order['status'], location?: { lat: number; lng: number }) {
  const orderRef = doc(db, 'orders', orderId);
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };
  if (location) {
    updates.currentLocation = location;
  }
  await updateDoc(orderRef, updates);
}

// Admin Users
export async function createAdminUser(email: string) {
  const usersCollection = collection(db, 'adminUsers');
  const now = new Date().toISOString();
  const newUser = {
    email,
    role: 'admin',
    created_at: now
  };
  const docRef = await addDoc(usersCollection, newUser);
  return {
    id: docRef.id,
    ...newUser
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const usersCollection = collection(db, 'adminUsers');
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AdminUser));
}

// Initialize default admin
export async function initializeDefaultAdmin() {
  const usersCollection = collection(db, 'adminUsers');
  const q = query(usersCollection, where('email', '==', 'Pranav2105'));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    await createAdminUser('Pranav2105');
  }
}