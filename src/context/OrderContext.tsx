// OrderContext.tsx

import React, { createContext, useContext, useState } from 'react';
import { Product } from '../lib/db';

type OrderItem = {
  product: Product;
  quantity: number;
};

type OrderContextType = {
  orderItems: OrderItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearOrder: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addItem = (product: Product, quantity: number) => {
    setOrderItems((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setOrderItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearOrder = () => setOrderItems([]);

  return (
    <OrderContext.Provider value={{ orderItems, addItem, removeItem, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
