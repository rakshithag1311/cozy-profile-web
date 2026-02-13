import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'cancelled' | 'rejected';

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
  createOrder: (items: CartItem[], shopId: string, shopName: string, totalPrice: number, pickupTime: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByShop: (shopId: string) => Order[];
  loadingOrders: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const mapDbOrder = (row: any): Order => ({
  id: row.id,
  items: (row.items as any[]) || [],
  status: row.status as OrderStatus,
  shopId: row.shop_id,
  shopName: row.shop_name,
  totalPrice: Number(row.total_price),
  pickupTime: row.pickup_time,
  createdAt: new Date(row.created_at),
});

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Load orders from DB
  const loadOrders = useCallback(async () => {
    if (!user) { setOrders([]); return; }
    setLoadingOrders(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data.map(mapDbOrder));
    setLoadingOrders(false);
  }, [user]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadOrders]);

  const generateOrderId = () => 'SF-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const createOrder = async (items: CartItem[], shopId: string, shopName: string, totalPrice: number, pickupTime: string) => {
    const orderId = generateOrderId();
    if (!user) throw new Error('Must be logged in');
    
    await supabase.from('orders').insert({
      id: orderId,
      user_id: user.id,
      shop_id: shopId,
      shop_name: shopName,
      items: items as any,
      total_price: totalPrice,
      pickup_time: pickupTime,
      status: 'new',
    });
    
    await loadOrders();
    return orderId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    await loadOrders();
  };

  const cancelOrder = async (orderId: string) => {
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    await loadOrders();
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
      cancelOrder,
      getOrderById,
      getOrdersByShop,
      loadingOrders,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
