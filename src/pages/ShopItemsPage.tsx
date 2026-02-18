import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Check, Tag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface Shop {
  id: string;
  name: string;
  category: string;
  prep_time: string;
  image: string;
  description: string;
}

const ShopItemsPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const { addToCart, totalItems, items } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [shopRes, itemsRes] = await Promise.all([
        supabase.from('shops').select('*').eq('id', shopId || '').maybeSingle(),
        supabase.from('shop_items').select('*').eq('shop_id', shopId || '').eq('available', true),
      ]);
      if (shopRes.data) setShop(shopRes.data);
      if (itemsRes.data) setShopItems(itemsRes.data);
      setLoading(false);
    };
    fetch();
  }, [shopId]);

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading menu...</p>
      </div>
    </div>
  );

  if (!shop) return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Shop not found</p>
        <button onClick={() => navigate('/shops')} className="btn-primary">Browse Shops</button>
      </div>
    </div>
  );

  const handleAddToCart = (item: ShopItem) => {
    addToCart({ id: item.id, name: item.name, price: item.price, shopId: shop.id });
    setAddedItems(prev => new Set(prev).add(item.id));
    toast.success(`${item.name} added to cart`);
    setTimeout(() => {
      setAddedItems(prev => { const next = new Set(prev); next.delete(item.id); return next; });
    }, 1200);
  };

  const getItemQuantity = (itemId: string) => items.find(i => i.id === itemId)?.quantity || 0;

  // Group by category
  const grouped = shopItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShopItem[]>);

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="glass sticky top-0 z-10 border-b">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate('/shops')}
                className="btn-ghost p-2.5 flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate leading-tight">{shop.name}</h1>
                <p className="text-xs text-muted-foreground">{shop.category} · {shop.prep_time || '10-15 min'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="relative p-3 rounded-2xl bg-primary text-primary-foreground flex-shrink-0 transition-all active:scale-95 shadow-primary"
              aria-label={`View cart (${totalItems} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-background">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="content-container pb-28">
        {shopItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
            <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-4">
              <Tag className="w-9 h-9 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No items available</h3>
            <p className="text-sm text-muted-foreground">Check back soon for menu updates</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, catItems], gi) => (
              <div key={category} className="fade-in" style={{ animationDelay: `${gi * 0.08}s` }}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{category}</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  {catItems.map((item) => {
                    const quantity = getItemQuantity(item.id);
                    const isAdded = addedItems.has(item.id);
                    return (
                      <div key={item.id} className="card-base flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
                              <p className="text-primary font-bold mt-1 text-sm">₹{item.price}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {quantity > 0 && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                              ×{quantity}
                            </span>
                          )}
                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`w-11 h-11 rounded-xl transition-all duration-300 flex items-center justify-center ${
                              isAdded
                                ? 'bg-success text-success-foreground scale-95'
                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-90'
                            }`}
                            aria-label={`Add ${item.name} to cart`}
                          >
                            {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => navigate('/cart')}
              className="btn-primary w-full flex items-center justify-center gap-2.5 text-base"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart · {totalItems} item{totalItems !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopItemsPage;
