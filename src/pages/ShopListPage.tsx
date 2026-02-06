import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { shops } from '@/data/shops';

const ShopListPage = () => {
  const navigate = useNavigate();

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

        {/* Shop List */}
        <div className="space-y-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="card-interactive flex items-center gap-4"
              onClick={() => navigate(`/shop/${shop.id}`)}
            >
              {/* Shop Icon */}
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center text-2xl flex-shrink-0">
                {shop.image}
              </div>

              {/* Shop Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {shop.name}
                </h3>
                <p className="text-sm text-muted-foreground">{shop.category}</p>
              </div>

              {/* Distance */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <MapPin className="w-4 h-4" />
                {shop.distance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopListPage;
