import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState('');
  const [shopName, setShopName] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (currentShopId) {
      supabase.from('shops').select('name').eq('id', currentShopId).maybeSingle().then(({ data }) => {
        if (data) setShopName(data.name);
      });
    }
  }, [currentShopId]);

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/auth'); return; }
    if (items.length === 0 || !currentShopId || !selectedTime) return;
    setPlacing(true);
    try {
      const orderId = await createOrder(items, currentShopId, shopName, totalPrice, selectedTime);
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  if (items.length === 0) {
    return (
      <div className="page-container fade-in">
        <div className="content-container flex flex-col min-h-screen">
          <div className="flex items-center gap-3 py-2 mb-6">
            <button onClick={() => navigate('/shops')} className="btn-ghost p-2.5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
            <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center mb-5">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-xs">Browse shops and add items to get started</p>
            <button onClick={() => navigate('/shops')} className="btn-primary">
              Browse Shops
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="glass sticky top-0 z-10 border-b">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn-ghost p-2.5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">Your Cart</h1>
              {shopName && <p className="text-xs text-muted-foreground">From {shopName}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container pb-32">
        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="card-base fade-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/70 transition-colors active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="font-bold text-foreground w-8 text-center text-base">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 text-primary transition-colors active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-bold text-primary text-base">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card-base mb-6 bg-primary/5 border-primary/15">
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border/50 pt-2">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* Time Slot Picker */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Choose Pickup Time</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4 ml-7">Pick a convenient time based on shop prep time</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTime === slot
                    ? 'bg-primary text-primary-foreground shadow-primary scale-[1.02]'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Place Order */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedTime || placing}
            className="btn-primary w-full text-base flex items-center justify-center gap-2"
          >
            {placing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Placing Order...
              </>
            ) : selectedTime ? (
              <>
                Place Order · {selectedTime}
                <ChevronRight className="w-4 h-4 opacity-80" />
              </>
            ) : (
              'Select a pickup time to continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
