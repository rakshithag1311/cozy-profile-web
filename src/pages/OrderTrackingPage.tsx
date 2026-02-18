import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Package, ChefHat, XCircle, AlertTriangle, MapPin } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { QRCodeSVG } from 'qrcode.react';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, cancelOrder } = useOrders();

  const order = getOrderById(orderId || '');

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

  const isActive = order.status !== 'cancelled' && order.status !== 'rejected';
  const canCancel = order.status === 'new' || order.status === 'preparing';

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new': return { label: 'Order Received', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready for Pickup', className: 'status-ready' };
      case 'cancelled': return { label: 'Cancelled', className: 'status-cancelled' };
      case 'rejected': return { label: 'Rejected', className: 'status-rejected' };
      default: return { label: status, className: 'status-new' };
    }
  };

  const steps = [
    { key: 'new', label: 'Order Placed', subLabel: 'Shop received your order', icon: Package, done: true },
    { key: 'preparing', label: 'Preparing', subLabel: 'Your items are being prepared', icon: ChefHat, done: order.status === 'preparing' || order.status === 'ready' },
    { key: 'ready', label: 'Ready for Pickup', subLabel: 'Head to the shop now!', icon: CheckCircle, done: order.status === 'ready' },
  ];

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="glass sticky top-0 z-10 border-b">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-ghost p-2.5">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground leading-tight">Track Order</h1>
            <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 12)}…</p>
          </div>
          <span className={statusDisplay.className}>{statusDisplay.label}</span>
        </div>
      </div>

      <div className="content-container">
        {/* QR Code */}
        <div className="card-base flex flex-col items-center p-6 mb-4 fade-in text-center">
          {isActive ? (
            <>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Show at Counter</p>
              <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                <QRCodeSVG value={order.id} size={140} />
              </div>
              <p className="text-xs text-muted-foreground">Present this QR code for pickup</p>
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <XCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">QR code no longer active</p>
            </div>
          )}
        </div>

        {/* Alerts */}
        {order.status === 'cancelled' && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted/60 border border-border mb-4 fade-in">
            <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Order Cancelled</p>
              <p className="text-xs text-muted-foreground mt-0.5">This order was cancelled successfully.</p>
            </div>
          </div>
        )}
        {order.status === 'rejected' && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/8 border border-destructive/20 mb-4 fade-in">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">Order Rejected</p>
              <p className="text-xs text-muted-foreground mt-0.5">This order was rejected by the shopkeeper.</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        {isActive && (
          <div className="card-base mb-4 fade-in stagger-1">
            <h2 className="text-sm font-bold text-foreground mb-5">Order Progress</h2>
            <div className="space-y-0">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isCurrent = (
                  (step.key === 'new' && order.status === 'new') ||
                  (step.key === 'preparing' && order.status === 'preparing') ||
                  (step.key === 'ready' && order.status === 'ready')
                );
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                        step.done ? 'bg-success/15 border-2 border-success/30' : 'bg-secondary border-2 border-border'
                      } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-1' : ''}`}>
                        <Icon className={`w-5 h-5 ${step.done ? 'text-success' : 'text-muted-foreground'}`} />
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 mb-1 rounded-full ${step.done ? 'bg-success/40' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pt-2.5">
                      <p className={`font-semibold text-sm leading-tight ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.subLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="card-base mb-4 fade-in stagger-2">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <div className="flex items-start gap-2 flex-1">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Shop</p>
                <p className="font-semibold text-foreground text-sm">{order.shopName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 flex-1">
              <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup at</p>
                <p className="font-semibold text-foreground text-sm">{order.pickupTime}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-foreground">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold pt-3 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary text-lg">₹{order.totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 fade-in stagger-3">
          {canCancel && (
            <button
              onClick={() => cancelOrder(order.id)}
              className="w-full py-3 rounded-2xl border-2 border-destructive/50 text-destructive font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 active:scale-[0.98] text-sm"
            >
              Cancel Order
            </button>
          )}
          <button onClick={() => navigate('/')} className="btn-secondary w-full">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
