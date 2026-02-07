import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, RefreshCw, Clock, QrCode } from 'lucide-react';
import { useOrders, Order, OrderStatus } from '@/contexts/OrderContext';
import { QRCodeSVG } from 'qrcode.react';

interface LoggedInShop {
  id: string;
  name: string;
}

const ShopkeeperDashboard = () => {
  const navigate = useNavigate();
  const { getOrdersByShop, updateOrderStatus } = useOrders();
  const [shop, setShop] = useState<LoggedInShop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedShop = localStorage.getItem('loggedInShop');
    if (!storedShop) { navigate('/shopkeeper/login'); return; }
    setShop(JSON.parse(storedShop));
  }, [navigate]);

  useEffect(() => {
    if (shop) setOrders(getOrdersByShop(shop.id));
  }, [shop, getOrdersByShop]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInShop');
    navigate('/shopkeeper/login');
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (shop) setOrders(getOrdersByShop(shop.id));
  };

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'new': return { label: 'New', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready', className: 'status-ready' };
      default: return { label: status, className: 'status-new' };
    }
  };

  const refreshOrders = () => { if (shop) setOrders(getOrdersByShop(shop.id)); };

  // Sort by pickup time
  const sortedOrders = [...orders].sort((a, b) => {
    const parseTime = (t: string) => {
      const [time, meridian] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (meridian === 'PM' && h !== 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return parseTime(a.pickupTime) - parseTime(b.pickupTime);
  });

  if (!shop) return null;

  return (
    <div className="page-container fade-in">
      <div className="content-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Incoming Orders</h1>
            <p className="text-sm text-muted-foreground">{shop.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refreshOrders} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
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
              return (
                <div key={order.id} className="card-base">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-foreground">{order.id}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        Pickup: {order.pickupTime}
                      </div>
                    </div>
                    <span className={statusDisplay.className}>{statusDisplay.label}</span>
                  </div>

                  {/* QR preview */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-secondary/50 rounded-xl">
                    <QRCodeSVG value={order.id} size={56} />
                    <div className="text-sm text-muted-foreground">
                      Scan to verify order
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{item.name} × {item.quantity}</span>
                        <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-border">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{order.totalPrice.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'preparing')} className="btn-primary flex-1 py-2">
                        Mark as Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => handleStatusUpdate(order.id, 'ready')} className="flex-1 py-2 bg-success text-success-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        Mark as Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <div className="flex-1 py-2 text-center text-success font-semibold">✓ Ready for Pickup</div>
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
