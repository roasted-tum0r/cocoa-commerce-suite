import { useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { SubscriptionModal } from "@/components/Modals/SubscriptionModal";
import { CookieModal } from "@/components/Modals/CookieModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, TrendingUp, Star, Users } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productWatch from "@/assets/product-watch.jpg";
import productMug from "@/assets/product-mug.jpg";
import { CategoryList } from "@/components/Sections/CategoryList";
import ProductsList from "@/components/Sections/ProductList";
import { ViewAllButton } from "@/components/ui/VewAllButton";
import { addToCart } from "@/redux/thunks/cartthunk";
import { appDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";

// Mock data


export const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { guestUserId } = useAppSelector((state) => state.cart);
  const handleAddToCart = (productId: string) => {
    // console.log("Add to cart:", productId);
    // Add to cart logic here
    appDispatch(
      addToCart({
        itemId: productId,
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
  };

  const handleToggleFavorite = (productId: string) => {
    console.log("Toggle favorite:", productId);
    // Toggle favorite logic here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex">
        {/* <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        /> */}

        <main className="flex-1">
          {/* Categories Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Shop by Category
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore our diverse range of categories and find exactly what
                  you're looking for.
                </p>
              </div> */}

              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="group p-6 rounded-lg border bg-card hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="text-4xl mb-4 text-center">{category.icon}</div>
                    <h3 className="font-semibold text-center mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      {category.count} products
                    </p>
                  </div>
                ))}
              </div> */}
              <CategoryList />
            </div>
          </section>
          {/* Hero Carousel Section */}
          <section className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="relative h-96 md:h-[500px] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-gradient-hero"
                      style={{ backgroundImage: `url(${heroBanner})` }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="relative h-full flex items-center">
                      <div className="container mx-auto px-4">
                        <div className="max-w-lg">
                          <Badge className="mb-4 bg-primary text-primary-foreground">
                            New Collection
                          </Badge>
                          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Premium Quality Products
                          </h1>
                          <p className="text-lg text-white/90 mb-6">
                            Discover our curated collection of premium products
                            with unmatched quality and style.
                          </p>
                          <Button
                            size="lg"
                            className="bg-primary hover:bg-primary-hover text-primary-foreground"
                          >
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              {/* <CarouselPrevious /> */}
              {/* <CarouselNext /> */}
            </Carousel>
          </section>

          {/* Stats Section */}
          <section className="py-12 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-3">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Latest Arrivals
                  </h2>
                  <p className="text-muted-foreground">
                    Discover our newest products and trending items.
                  </p>
                </div>
                <ViewAllButton />
              </div>
              {/* products section */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div> */}
              <ProductsList
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-primary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Join Our Community
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Get exclusive access to new arrivals, special offers, and
                member-only discounts.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowSubscriptionModal(true)}
              >
                Sign Up Today
              </Button>
            </div>
          </section>
        </main>
      </div>

      <Footer />

      {/* Modals */}
      <SubscriptionModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
      />
      <CookieModal />
    </div>
  );
};
