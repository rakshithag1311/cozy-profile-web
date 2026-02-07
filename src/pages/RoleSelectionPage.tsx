import { useNavigate } from 'react-router-dom';
import { User, Store, Zap } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col items-center justify-center min-h-screen text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Smartfetch</h1>
        <p className="text-muted-foreground mb-10">Choose your role to continue</p>

        <div className="w-full space-y-4 max-w-sm">
          <button
            onClick={() => navigate('/home')}
            className="card-interactive w-full flex items-center gap-4 p-6"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">Continue as Customer</p>
              <p className="text-sm text-muted-foreground">Browse shops, order & pick up</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/shopkeeper/login')}
            className="card-interactive w-full flex items-center gap-4 p-6"
          >
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <Store className="w-7 h-7 text-accent-foreground" />
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-lg">Continue as Shopkeeper</p>
              <p className="text-sm text-muted-foreground">Manage orders & update status</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
