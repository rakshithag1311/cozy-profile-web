import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Clock, QrCode, ShoppingBag, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col items-center justify-center min-h-screen text-center relative">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {/* Profile Avatar */}
        <Avatar className="w-20 h-20 mb-4 border-2 border-primary/20">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
            {user?.user_metadata?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>

        <p className="text-sm text-primary font-semibold mb-2">Welcome, {user?.user_metadata?.display_name || 'Customer'}</p>

        <h1 className="text-4xl font-bold text-foreground mb-2">Smartfetch</h1>
        <p className="text-lg font-medium text-primary mb-4">Pick fast · Go smart</p>
        <p className="text-muted-foreground mb-10 max-w-xs leading-relaxed">
          Pre-order from nearby shops, choose a pickup time, and skip the waiting line.
        </p>

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

        <button onClick={() => navigate('/shops')} className="btn-primary flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5" />
          Find Shops
        </button>

        <button onClick={() => navigate('/')} className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to role selection
        </button>
      </div>
    </div>
  );
};

export default HomePage;
