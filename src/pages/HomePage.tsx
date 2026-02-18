import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Clock, QrCode, ShoppingBag, LogOut, User, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
  { icon: ShoppingBag, label: 'Pre-order', desc: 'Browse & order ahead', delay: 'stagger-1' },
  { icon: Clock, label: 'Pick time', desc: 'Choose pickup slot', delay: 'stagger-2' },
  { icon: QrCode, label: 'QR pickup', desc: 'Skip the queue', delay: 'stagger-3' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Customer';
  const initial = displayName[0]?.toUpperCase() || 'C';

  return (
    <div className="page-container hero-gradient overflow-hidden">
      <div className="content-container flex flex-col items-center min-h-screen text-center relative">
        
        {/* Top bar */}
        <div className="w-full flex items-center justify-between pt-2 pb-6 fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-foreground tracking-tight">Smartfetch</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost flex items-center gap-1.5 text-sm"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center w-full py-8">
          {/* Avatar with glow ring */}
          <div className="relative mb-6 fade-in stagger-1">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-150 opacity-60" />
            <Avatar className="w-24 h-24 border-4 border-card relative ring-2 ring-primary/20 shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>

          <p className="text-sm text-primary font-semibold mb-1 fade-in stagger-1">
            👋 Welcome back
          </p>
          <h1 className="text-3xl font-bold text-foreground mb-1 fade-in stagger-2">
            {displayName}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed fade-in stagger-2 text-sm">
            Pre-order from nearby shops, choose a pickup time, and skip the queue.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-sm">
            {features.map(({ icon: Icon, label, desc, delay }) => (
              <div
                key={label}
                className={`fade-in ${delay} flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">{label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight hidden sm:block">{desc}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/shops')}
            className="btn-primary flex items-center gap-2.5 text-base w-full max-w-xs justify-center fade-in stagger-4"
          >
            <MapPin className="w-5 h-5" />
            Find Nearby Shops
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <p className="mt-6 text-xs text-muted-foreground fade-in stagger-5">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
