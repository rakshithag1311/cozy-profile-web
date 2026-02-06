import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Clock, Home } from 'lucide-react';
import { useOrders } from '@/contexts/OrderContext';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId || '');

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'New', className: 'status-new' };
      case 'preparing':
        return { label: 'Preparing', className: 'status-preparing' };
      case 'ready':
        return { label: 'Ready for Pickup', className: 'status-ready' };
      default:
        return { label: status, className: 'status-new' };
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

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order
        </p>

        {/* Order Details Card */}
        <div className="card-base w-full text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-foreground text-lg">{order.id}</p>
            </div>
            <span className={statusDisplay.className}>
              {statusDisplay.label}
            </span>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-2">From</p>
            <p className="font-medium text-foreground">{order.shopName}</p>
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-2">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.name} × {item.quantity}</span>
                <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-center gap-2 text-muted-foreground mb-8 bg-secondary p-4 rounded-xl w-full">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm text-left">
            Collect your order when marked as "Ready for Pickup"
          </p>
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
