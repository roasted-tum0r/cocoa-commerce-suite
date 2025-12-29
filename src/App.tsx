import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { AccountSettings } from "./pages/AccountSettings";
import { ProductDetail } from "./pages/ProductDetail";
import { SearchResults } from "./pages/SearchResults";
import Login from "./pages/Login";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";
import { AuthModalProvider } from "./context/AuthModalContext";
import { AuthModal } from "./components/auth/AuthModal";

const queryClient = new QueryClient();

import { FeaturedPage } from "./pages/FeaturedPage";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { ContactPage } from "./pages/ContactPage";

import { AllProductsPage } from "./pages/AllProductsPage";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/product/:name" element={<ProductDetail />} />
            <Route path="/all-products" element={<AllProductsPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/featured" element={<FeaturedPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AuthModal />
        </BrowserRouter>
      </AuthModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
