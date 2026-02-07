import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'new' | 'preparing' | 'ready';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  shopId: string;
  shopName: string;
  totalPrice: number;
  pickupTime: string;
  createdAt: Date;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], shopId: string, shopName: string, totalPrice: number, pickupTime: string) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByShop: (shopId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const generateOrderId = () => {
    return 'SF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createOrder = (items: CartItem[], shopId: string, shopName: string, totalPrice: number, pickupTime: string) => {
    const newOrder: Order = {
      id: generateOrderId(),
      items,
      status: 'new',
      shopId,
      shopName,
      totalPrice,
      pickupTime,
      createdAt: new Date()
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const getOrdersByShop = useCallback((shopId: string) => {
    return orders.filter(order => order.shopId === shopId);
  }, [orders]);

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getOrdersByShop
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
