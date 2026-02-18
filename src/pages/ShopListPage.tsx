import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Store, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const categories = ['All', 'Grocery', 'Bakery', 'Convenience', 'Organic', 'Cafe', 'Snacks'];

interface Shop {
  id: string;
  name: string;
  category: string;
  prep_time: string;
  image: string;
  description: string;
}

const ShopListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      const { data } = await supabase.from('shops').select('*');
      if (data) setShops(data);
      setLoading(false);
    };
    fetchShops();
  }, []);

  const filtered = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container fade-in">
      {/* Sticky header */}
      <div className="glass sticky top-0 z-10 border-b">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/home')}
              className="btn-ghost p-2.5"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground leading-tight">Nearby Shops</h1>
              <p className="text-xs text-muted-foreground">{shops.length} shops available</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search shops or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 text-sm"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-primary'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-container pt-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-base flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-muted flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded-lg w-2/3" />
                  <div className="h-3 bg-muted rounded-lg w-1/3" />
                  <div className="h-3 bg-muted rounded-lg w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((shop, i) => (
              <div
                key={shop.id}
                onClick={() => navigate(`/shop/${shop.id}`)}
                className={`card-interactive flex items-center gap-4 fade-in`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Shop icon / emoji */}
                <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {shop.image || <Store className="w-7 h-7 text-primary" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate leading-tight">{shop.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{shop.category}</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 flex-shrink-0 mt-1 opacity-50" />
                  </div>
                  {shop.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 truncate leading-relaxed">{shop.description}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/8 border border-primary/10">
                      <Clock className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">{shop.prep_time || '10-15 min'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
                <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-4">
                  <SlidersHorizontal className="w-9 h-9 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">No shops found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different search or category
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); }}
                  className="mt-4 text-sm text-primary font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopListPage;
