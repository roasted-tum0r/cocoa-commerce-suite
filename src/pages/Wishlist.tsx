import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { ProductCard } from "@/components/Product/ProductCard";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import productBanana from "@/assets/product-headphones.jpg";
import productApple from "@/assets/product-watch.jpg";
import productNuts from "@/assets/product-mug.jpg";

// Mock wishlist data - fruits, food, and dry fruits
const wishlistItems = [
  {
    id: "1",
    name: "Organic Bananas",
    price: 4.99,
    originalPrice: 6.99,
    rating: 4.8,
    reviewCount: 124,
    image: productBanana,
    category: "Fruits",
    isNew: true,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Fresh Red Apples",
    price: 7.99,
    rating: 4.6,
    reviewCount: 89,
    image: productApple,
    category: "Fruits",
    isNew: false,
    isFavorite: true,
  },
  {
    id: "3",
    name: "Premium Mixed Nuts",
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.9,
    reviewCount: 56,
    image: productNuts,
    category: "Dry Fruits",
    isNew: false,
    isFavorite: true,
  },
];

export const Wishlist = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState(wishlistItems);

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Add to cart logic here
  };

  const handleToggleFavorite = (productId: string) => {
    setItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const handleAddAllToCart = () => {
    console.log("Adding all wishlist items to cart");
    // Add all items to cart logic here
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-8 w-8 text-favorite" />
                  My Wishlist
                </h1>
                <p className="text-muted-foreground mt-2">
                  {items.length} items saved for later
                </p>
              </div>
              {items.length > 0 && (
                <Button onClick={handleAddAllToCart} className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart
                </Button>
              )}
            </div>

            {/* Wishlist Items */}
            {items.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start adding items you love to your wishlist
                </p>
                <Button>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};