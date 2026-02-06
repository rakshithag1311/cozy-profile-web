import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, ArrowLeft } from 'lucide-react';

// Demo credentials
const DEMO_SHOPS = [
  { id: 'shop-1', password: 'pass123', name: 'Fresh Mart Grocery' },
  { id: 'shop-2', password: 'pass123', name: 'Golden Bakery' },
  { id: 'shop-3', password: 'pass123', name: 'Daily Essentials' },
  { id: 'shop-4', password: 'pass123', name: 'Green Valley Organics' },
  { id: 'shop-5', password: 'pass123', name: 'Quick Bites Cafe' },
];

const ShopkeeperLoginPage = () => {
  const navigate = useNavigate();
  const [shopId, setShopId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const shop = DEMO_SHOPS.find(s => s.id === shopId && s.password === password);
    
    if (shop) {
      // Store logged in shop info
      localStorage.setItem('loggedInShop', JSON.stringify(shop));
      navigate('/shopkeeper/dashboard');
    } else {
      setError('Invalid Shop ID or Password');
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="content-container flex flex-col justify-center min-h-screen">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Shopkeeper Login</h1>
          <p className="text-muted-foreground mt-2">Access your order dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Shop ID
            </label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                placeholder="Enter your Shop ID"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-6">
            Login
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-secondary rounded-xl">
          <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
          <p className="text-sm text-muted-foreground">Shop ID: shop-1, shop-2, etc.</p>
          <p className="text-sm text-muted-foreground">Password: pass123</p>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperLoginPage;
