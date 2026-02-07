import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";

import HomePage from "./pages/HomePage";
import ShopListPage from "./pages/ShopListPage";
import ShopItemsPage from "./pages/ShopItemsPage";
import CartPage from "./pages/CartPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ShopkeeperLoginPage from "./pages/ShopkeeperLoginPage";
import ShopkeeperDashboard from "./pages/ShopkeeperDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <OrderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shops" element={<ShopListPage />} />
              <Route path="/shop/:shopId" element={<ShopItemsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/track/:orderId" element={<OrderTrackingPage />} />
              <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />
              <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
