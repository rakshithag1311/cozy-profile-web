import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Search } from 'lucide-react';
import { shops } from '@/data/shops';

const categories = ['All', 'Grocery', 'Bakery', 'Convenience', 'Organic', 'Cafe', 'Snacks'];

const ShopListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container fade-in">
      <div className="content-container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Nearby Shops</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Shop List */}
        <div className="space-y-4">
          {filtered.map((shop) => (
            <div
              key={shop.id}
              className="card-interactive flex items-center gap-4"
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl flex-shrink-0">
                {shop.image}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{shop.name}</h3>
                <p className="text-sm text-muted-foreground">{shop.category}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {shop.prepTime}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <MapPin className="w-4 h-4" />
                {shop.distance}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No shops found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopListPage;
