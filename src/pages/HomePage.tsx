import { useNavigate } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';

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
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Smartflask
        </h1>

        {/* Tagline */}
        <p className="text-xl text-muted-foreground mb-12">
          Pick Fast. Go Smart.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/shops')}
          className="btn-primary flex items-center gap-2 text-lg"
        >
          <MapPin className="w-5 h-5" />
          Find Nearby Shops
        </button>

        {/* Shopkeeper Link */}
        <button
          onClick={() => navigate('/shopkeeper/login')}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Are you a shopkeeper? Login here →
        </button>
      </div>
    </div>
  );
};

export default HomePage;
