import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Check } from 'lucide-react';
import { getShopById, getShopItems } from '@/data/shops';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

const ShopItemsPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const { addToCart, totalItems, items } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const shop = getShopById(shopId || '');
  const shopItems = getShopItems(shopId || '');

  if (!shop) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  const handleAddToCart = (item: typeof shopItems[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, shopId: shop.id });
    setAddedItems(prev => new Set(prev).add(item.id));
    toast.success(`${item.name} added to cart`);
    setTimeout(() => {
      setAddedItems(prev => { const next = new Set(prev); next.delete(item.id); return next; });
    }, 1000);
  };

  const getItemQuantity = (itemId: string) => items.find(i => i.id === itemId)?.quantity || 0;

  return (
    <div className="page-container fade-in">
      <div className="content-container pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/shops')} className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{shop.name}</h1>
              <p className="text-sm text-muted-foreground">{shop.category} · {shop.prepTime}</p>
            </div>
          </div>
          <button onClick={() => navigate('/cart')} className="relative p-3 rounded-xl bg-primary text-primary-foreground">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {shopItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            const isAdded = addedItems.has(item.id);
            return (
              <div key={item.id} className="card-base flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  <p className="text-primary font-semibold mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  {quantity > 0 && (
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-lg">×{quantity}</span>
                  )}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`p-3 rounded-xl transition-all duration-200 ${isAdded ? 'bg-success text-success-foreground' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                  >
                    {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="max-w-lg mx-auto">
            <button onClick={() => navigate('/cart')} className="btn-primary w-full flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              View Cart ({totalItems} items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopItemsPage;
