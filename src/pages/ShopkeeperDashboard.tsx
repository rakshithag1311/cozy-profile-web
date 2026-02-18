import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, RefreshCw, Clock, Plus, Store, ChefHat, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
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

const statusConfig = {
  new:       { label: 'New',       className: 'status-new',       icon: AlertCircle },
  preparing: { label: 'Preparing', className: 'status-preparing', icon: ChefHat },
  ready:     { label: 'Ready',     className: 'status-ready',      icon: CheckCircle },
  cancelled: { label: 'Cancelled', className: 'status-cancelled',  icon: XCircle },
  rejected:  { label: 'Rejected',  className: 'status-rejected',   icon: XCircle },
};

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

    const newShopId = crypto.randomUUID();
    const { error } = await supabase.from('shops').insert({
      id: newShopId,
      name: newShopName,
      category: newShopCategory,
      description: newShopDescription,
    });

    if (error) {
      toast.error('Failed to create shop: ' + error.message);
      setCreatingShop(false);
      return;
    }

    const { error: staffError } = await supabase.from('shop_staff').insert({
      user_id: user.id,
      shop_id: newShopId,
    });

    if (staffError) {
      toast.error('Shop created but failed to link: ' + staffError.message);
    } else {
      toast.success('Shop created successfully!');
    }

    setCreatingShop(false);
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

  const sortedOrders = [...orders].sort((a, b) => {
    const parseTime = (t: string) => {
      const [time, meridian] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (meridian === 'PM' && h !== 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    try { return parseTime(a.pickup_time) - parseTime(b.pickup_time); }
    catch { return 0; }
  });

  const newCount = orders.filter(o => o.status === 'new').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  if (authLoading || loading) return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    </div>
  );

  // Create Shop flow
  if (!shopId || showCreateShop) {
    return (
      <div className="page-container fade-in">
        <div className="content-container flex flex-col items-center justify-center min-h-screen">
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 btn-ghost flex items-center gap-1.5 text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150 opacity-40" />
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center relative shadow-primary">
              <Store className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1 text-center">Set Up Your Shop</h1>
          <p className="text-muted-foreground mb-8 text-sm text-center max-w-xs">
            Create your shop profile to start receiving orders from customers
          </p>

          <form onSubmit={handleCreateShop} className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Shop Name</label>
              <input
                type="text"
                value={newShopName}
                onChange={e => setNewShopName(e.target.value)}
                placeholder="e.g. Campus Café"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
              <input
                type="text"
                value={newShopCategory}
                onChange={e => setNewShopCategory(e.target.value)}
                placeholder="e.g. Food, Stationery, Xerox"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <textarea
                value={newShopDescription}
                onChange={e => setNewShopDescription(e.target.value)}
                placeholder="A short description of your shop..."
                className="input-field min-h-[90px] resize-none"
                required
              />
            </div>
            <button type="submit" disabled={creatingShop} className="btn-primary w-full flex items-center justify-center gap-2">
              {creatingShop ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Shop
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="glass sticky top-0 z-10 border-b">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-primary font-semibold">Shopkeeper</p>
                <h1 className="text-lg font-bold text-foreground leading-tight truncate">{shopInfo?.name || 'Dashboard'}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                className="btn-ghost p-2.5"
                title="Refresh orders"
                aria-label="Refresh orders"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
          {[
            { label: 'New', count: newCount, color: 'bg-info/10 border-info/20 text-info' },
            { label: 'Preparing', count: preparingCount, color: 'bg-warning/10 border-warning/20 text-warning' },
            { label: 'Ready', count: readyCount, color: 'bg-success/10 border-success/20 text-success' },
          ].map(stat => (
            <div key={stat.label} className={`card-base text-center py-3 ${stat.color} border`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs font-semibold mt-0.5 opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">
            Incoming Orders
            {orders.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">({orders.length} total)</span>
            )}
          </h2>
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
        </div>

        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
            <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center mb-5">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Orders will appear here when customers place them. Share your shop with customers!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order, i) => {
              const config = statusConfig[order.status] || statusConfig.new;
              const items = order.items as any[];
              return (
                <div
                  key={order.id}
                  className="card-base fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-0.5">#{order.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        Pickup: {order.pickup_time}
                      </div>
                    </div>
                    <span className={config.className}>{config.label}</span>
                  </div>

                  {/* QR + items */}
                  <div className="flex gap-4 mb-4">
                    <div className="bg-white p-2.5 rounded-xl border border-border flex-shrink-0">
                      <QRCodeSVG value={order.id} size={56} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm mb-1 last:mb-0">
                          <span className="text-foreground truncate">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                          <span className="font-medium text-foreground ml-2 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border text-sm">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary">₹{Number(order.total_price).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                          className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
                        >
                          <ChefHat className="w-4 h-4" />
                          Accept & Prepare
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'rejected')}
                          className="flex-1 py-2.5 text-sm border-2 border-destructive/40 text-destructive rounded-2xl font-semibold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200 active:scale-[0.97]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 py-2.5 text-sm bg-success text-success-foreground rounded-2xl font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <div className="flex-1 py-2.5 text-center text-success font-semibold text-sm flex items-center justify-center gap-1.5 bg-success/10 rounded-2xl">
                        <CheckCircle className="w-4 h-4" />
                        Ready for Pickup
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="flex-1 py-2.5 text-center text-muted-foreground font-semibold text-sm bg-muted rounded-2xl">
                        Cancelled by Customer
                      </div>
                    )}
                    {order.status === 'rejected' && (
                      <div className="flex-1 py-2.5 text-center text-destructive font-semibold text-sm bg-destructive/10 rounded-2xl">
                        Order Rejected
                      </div>
                    )}
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
