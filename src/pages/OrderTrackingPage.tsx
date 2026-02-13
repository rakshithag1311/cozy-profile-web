import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Package, ChefHat, XCircle, AlertTriangle } from 'lucide-react';
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
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const isActive = order.status !== 'cancelled' && order.status !== 'rejected';
  const canCancel = order.status === 'new' || order.status === 'preparing';

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new': return { label: 'New', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready for Pickup', className: 'status-ready' };
      case 'cancelled': return { label: 'Cancelled', className: 'status-cancelled' };
      case 'rejected': return { label: 'Rejected', className: 'status-rejected' };
      default: return { label: status, className: 'status-new' };
    }
  };

  const steps = [
    { key: 'new', label: 'Order Placed', icon: Package, done: true },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, done: order.status === 'preparing' || order.status === 'ready' },
    { key: 'ready', label: 'Ready for Pickup', icon: CheckCircle, done: order.status === 'ready' },
  ];

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="page-container fade-in">
      <div className="content-container">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Track Order</h1>
            <p className="text-sm text-muted-foreground">{order.id}</p>
          </div>
          <span className={`ml-auto ${statusDisplay.className}`}>{statusDisplay.label}</span>
        </div>

        {/* QR Code */}
        <div className="card-base flex flex-col items-center p-6 mb-6">
          {isActive ? (
            <>
              <QRCodeSVG value={order.id} size={140} />
              <p className="text-sm text-muted-foreground mt-3">Show at shop for pickup</p>
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <XCircle className="w-12 h-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">QR code is no longer active</p>
            </div>
          )}
        </div>

        {order.status === 'cancelled' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted border border-border mb-6">
            <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">Order cancelled successfully.</p>
          </div>
        )}
        {order.status === 'rejected' && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">This order was rejected by the shopkeeper.</p>
          </div>
        )}

        {isActive && (
          <div className="card-base mb-6">
            <h2 className="section-title">Order Status</h2>
            <div className="space-y-0">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? 'bg-success/20' : 'bg-secondary'}`}>
                        <Icon className={`w-5 h-5 ${step.done ? 'text-success' : 'text-muted-foreground'}`} />
                      </div>
                      {i < steps.length - 1 && <div className={`w-0.5 h-8 ${step.done ? 'bg-success/40' : 'bg-border'}`} />}
                    </div>
                    <div className="pt-2">
                      <p className={`font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="card-base mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Pickup at {order.pickupTime}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{order.shopName}</p>
          <div className="border-t border-border pt-3">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.name} × {item.quantity}</span>
                <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-primary">₹{order.totalPrice.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {canCancel && (
          <button onClick={() => cancelOrder(order.id)}
            className="w-full py-3 rounded-xl border-2 border-destructive text-destructive font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors mb-3">
            Cancel Order
          </button>
        )}

        <button onClick={() => navigate('/')} className="btn-secondary w-full">Back to Home</button>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
