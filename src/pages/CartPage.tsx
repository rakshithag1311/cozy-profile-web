import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { getShopById } from '@/data/shops';

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM'
];

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice, currentShopId } = useCart();
  const { createOrder } = useOrders();
  const [selectedTime, setSelectedTime] = useState('');

  const shop = currentShopId ? getShopById(currentShopId) : null;

  const handlePlaceOrder = () => {
    if (items.length === 0 || !currentShopId || !shop || !selectedTime) return;
    const orderId = createOrder(items, currentShopId, shop.name, totalPrice, selectedTime);
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="page-container fade-in">
        <div className="content-container">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/shops')} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items from a shop to get started</p>
            <button onClick={() => navigate('/shops')} className="btn-primary">Browse Shops</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="content-container pb-32">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
            {shop && <p className="text-sm text-muted-foreground">From {shop.name}</p>}
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card-base">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="font-semibold text-foreground w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <p className="font-semibold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card-base mt-6">
          <div className="flex justify-between items-center text-muted-foreground mb-2">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-foreground">
            <span>Total</span>
            <span className="text-primary">₹{totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Pickup Time Selection */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="section-title mb-0">Choose Pickup Time</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pickup time depends on shop preparation time ({shop?.prepTime}).
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedTime === slot
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedTime}
            className="btn-primary w-full text-lg"
          >
            {selectedTime ? `Place Order · Pickup at ${selectedTime}` : 'Select a pickup time'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
