import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, QrCode } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';
import { QRCodeSVG } from 'qrcode.react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId || '');

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new': return { label: 'New', className: 'status-new' };
      case 'preparing': return { label: 'Preparing', className: 'status-preparing' };
      case 'ready': return { label: 'Ready for Pickup', className: 'status-ready' };
      default: return { label: status, className: 'status-new' };
    }
  };

  if (!order) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col items-center justify-center min-h-screen text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your order</p>

        {/* QR Code */}
        <div className="card-base w-full flex flex-col items-center p-6 mb-6">
          <div className="bg-background p-4 rounded-xl mb-4">
            <QRCodeSVG value={order.id} size={160} />
          </div>
          <p className="text-sm text-muted-foreground">
            Show this QR code at the shop during pickup
          </p>
        </div>

        {/* Order Details */}
        <div className="card-base w-full text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-foreground text-lg">{order.id}</p>
            </div>
            <span className={statusDisplay.className}>{statusDisplay.label}</span>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-1">From</p>
            <p className="font-medium text-foreground">{order.shopName}</p>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-1">Pickup Time</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <p className="font-medium text-foreground">{order.pickupTime}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.name} × {item.quantity}</span>
                <span className="text-muted-foreground">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{order.totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Track Button */}
        <button
          onClick={() => navigate(`/track/${order.id}`)}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
        >
          <QrCode className="w-5 h-5" />
          Track Order Status
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-secondary w-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
