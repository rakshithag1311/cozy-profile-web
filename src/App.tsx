import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AuthProvider } from "@/contexts/AuthContext";

import RoleSelectionPage from "./pages/RoleSelectionPage";
import HomePage from "./pages/HomePage";
import ShopListPage from "./pages/ShopListPage";
import ShopItemsPage from "./pages/ShopItemsPage";
import CartPage from "./pages/CartPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<RoleSelectionPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/shops" element={<ShopListPage />} />
                <Route path="/shop/:shopId" element={<ShopItemsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                <Route path="/track/:orderId" element={<OrderTrackingPage />} />
                <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
