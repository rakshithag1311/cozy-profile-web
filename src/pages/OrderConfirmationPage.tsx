import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, QrCode, MapPin, ShoppingBag } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { QRCodeSVG } from 'qrcode.react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId || '');

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new': return { label: 'Received', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready for Pickup', className: 'status-ready' };
      case 'cancelled': return { label: 'Cancelled', className: 'status-cancelled' };
      case 'rejected': return { label: 'Rejected', className: 'status-rejected' };
      default: return { label: status, className: 'status-new' };
    }
  };

  if (!order) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="page-container fade-in">
      <div className="content-container pb-8">
        {/* Success hero */}
        <div className="flex flex-col items-center text-center pt-10 pb-8 fade-in">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-success/20 blur-xl scale-150" />
            <div className="w-24 h-24 rounded-full bg-success/15 border-2 border-success/30 flex items-center justify-center relative">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Order Placed!</h1>
          <p className="text-muted-foreground text-sm">Your order has been sent to {order.shopName}</p>
        </div>

        {/* QR Card */}
        <div className="card-base flex flex-col items-center p-6 mb-4 fade-in stagger-1 text-center border-2 border-primary/15 bg-primary/3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Pickup QR Code</p>
          <div className="bg-white p-4 rounded-2xl shadow-md mb-4">
            <QRCodeSVG value={order.id} size={160} />
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            Show this code at the shop counter for express pickup
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card-base mb-4 fade-in stagger-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
              <p className="font-mono text-sm font-semibold text-foreground">{order.id.slice(0, 8)}…</p>
            </div>
            <span className={statusDisplay.className}>{statusDisplay.label}</span>
          </div>

          {/* Shop & Time */}
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">From</p>
                <p className="font-semibold text-foreground text-sm leading-tight">{order.shopName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup at</p>
                <p className="font-semibold text-foreground text-sm">{order.pickupTime}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-1.5 mb-3">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</p>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                  <span className="font-medium text-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total Paid</span>
            <span className="text-xl font-bold text-primary">₹{order.totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 fade-in stagger-3">
          <button
            onClick={() => navigate(`/track/${order.id}`)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Track Order Status
          </button>
          <button
            onClick={() => navigate('/home')}
            className="btn-secondary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
