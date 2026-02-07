import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Clock, QrCode, ShoppingBag } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col items-center justify-center min-h-screen text-center">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Zap className="w-10 h-10 text-primary" />
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Smartfetch
        </h1>

        {/* Tagline */}
        <p className="text-lg font-medium text-primary mb-4">
          Pick fast · Go smart
        </p>

        {/* Description */}
        <p className="text-muted-foreground mb-10 max-w-xs leading-relaxed">
          Pre-order from nearby shops, choose a pickup time, and skip the waiting line.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Pre-order</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Pick time</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">QR pickup</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/shops')}
          className="btn-primary flex items-center gap-2 text-lg"
        >
          <MapPin className="w-5 h-5" />
          Find Shops
        </button>

        {/* Shopkeeper Link */}
        <button
          onClick={() => navigate('/')}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to role selection
        </button>
      </div>
    </div>
  );
};

export default HomePage;
