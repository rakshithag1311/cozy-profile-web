import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, RefreshCw, Clock, Plus, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

type OrderStatus = 'new' | 'preparing' | 'ready' | 'cancelled' | 'rejected';

interface Order {
  id: string;
  items: any[];
  status: OrderStatus;
  shop_id: string;
  shop_name: string;
  total_price: number;
  pickup_time: string;
  created_at: string;
}

interface ShopInfo {
  id: string;
  name: string;
  category: string;
  description: string;
}

const ShopkeeperDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, shopId, userRole, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);

  // Shop creation state
  const [showCreateShop, setShowCreateShop] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState('');
  const [newShopDescription, setNewShopDescription] = useState('');
  const [creatingShop, setCreatingShop] = useState(false);

  const fetchShopInfo = async (id: string) => {
    const { data } = await supabase.from('shops').select('id, name, category, description').eq('id', id).single();
    if (data) setShopInfo(data);
  };

  const fetchOrders = async () => {
    if (!shopId) return;
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/auth', { replace: true }); return; }
    if (userRole !== 'shopkeeper') { navigate('/', { replace: true }); return; }
    if (shopId) {
      fetchShopInfo(shopId);
      fetchOrders();
    } else {
      setLoading(false);
      setShowCreateShop(true);
    }
  }, [user, userRole, shopId, authLoading, navigate]);

  // Realtime
  useEffect(() => {
    if (!shopId) return;
    const channel = supabase
      .channel('shopkeeper-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `shop_id=eq.${shopId}` }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [shopId]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreatingShop(true);

    const shopId = crypto.randomUUID();
    const { error } = await supabase.from('shops').insert({
      id: shopId,
      name: newShopName,
      category: newShopCategory,
      description: newShopDescription,
    });

    if (error) {
      toast.error('Failed to create shop: ' + error.message);
      setCreatingShop(false);
      return;
    }

    // Link shopkeeper to shop
    const { error: staffError } = await supabase.from('shop_staff').insert({
      user_id: user.id,
      shop_id: shopId,
    });

    if (staffError) {
      toast.error('Shop created but failed to link: ' + staffError.message);
    } else {
      toast.success('Shop created successfully!');
    }

    setCreatingShop(false);
    // Reload to pick up new shopId from AuthContext
    window.location.reload();
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'new': return { label: 'New', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready', className: 'status-ready' };
      case 'cancelled': return { label: 'Cancelled', className: 'status-cancelled' };
      case 'rejected': return { label: 'Rejected', className: 'status-rejected' };
      default: return { label: status, className: 'status-new' };
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const parseTime = (t: string) => {
      const [time, meridian] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (meridian === 'PM' && h !== 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return parseTime(a.pickup_time) - parseTime(b.pickup_time);
  });

  if (authLoading || loading) return <div className="page-container flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></div>;

  // No shop yet — show create shop form
  if (!shopId || showCreateShop) {
    return (
      <div className="page-container fade-in">
        <div className="content-container flex flex-col items-center justify-center min-h-screen">
          <button onClick={handleLogout} className="absolute top-6 right-6 p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm text-muted-foreground">
            <LogOut className="w-4 h-4" /> Logout
          </button>

          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, Shopkeeper</h1>
          <p className="text-muted-foreground mb-8">Create your shop to start receiving orders</p>

          <form onSubmit={handleCreateShop} className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Shop Name</label>
              <input type="text" value={newShopName} onChange={e => setNewShopName(e.target.value)} placeholder="e.g. Campus Café" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <input type="text" value={newShopCategory} onChange={e => setNewShopCategory(e.target.value)} placeholder="e.g. Food, Stationery, Xerox" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea value={newShopDescription} onChange={e => setNewShopDescription(e.target.value)} placeholder="A short description of your shop" className="input-field min-h-[80px]" required />
            </div>
            <button type="submit" disabled={creatingShop} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              {creatingShop ? 'Creating...' : 'Create Shop'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-primary font-semibold">Welcome, Shopkeeper</p>
            <h1 className="text-2xl font-bold text-foreground">{shopInfo?.name || 'Incoming Orders'}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchOrders} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
              <RefreshCw className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors">
              <LogOut className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              const items = order.items as any[];
              return (
                <div key={order.id} className="card-base">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-foreground">{order.id}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pickup: {order.pickup_time}
                      </div>
                    </div>
                    <span className={statusDisplay.className}>{statusDisplay.label}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 p-3 bg-secondary/50 rounded-xl">
                    <QRCodeSVG value={order.id} size={56} />
                    <div className="text-sm text-muted-foreground">Scan to verify order</div>
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{item.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-border">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{Number(order.total_price).toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <>
                        <button onClick={() => handleStatusUpdate(order.id, 'preparing')} className="btn-primary flex-1 py-2">Accept & Prepare</button>
                        <button onClick={() => handleStatusUpdate(order.id, 'rejected')} className="flex-1 py-2 border-2 border-destructive text-destructive rounded-xl font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors">Reject</button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'ready')} className="flex-1 py-2 bg-success text-success-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">Mark as Ready</button>
                    )}
                    {order.status === 'ready' && <div className="flex-1 py-2 text-center text-success font-semibold">✓ Ready for Pickup</div>}
                    {order.status === 'cancelled' && <div className="flex-1 py-2 text-center text-muted-foreground font-semibold">Cancelled by Customer</div>}
                    {order.status === 'rejected' && <div className="flex-1 py-2 text-center text-destructive font-semibold">Order Rejected</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
