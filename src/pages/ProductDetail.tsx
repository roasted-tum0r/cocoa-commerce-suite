import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import productBanana from "@/assets/product-headphones.jpg";
import productApple from "@/assets/product-watch.jpg";
import productNuts from "@/assets/product-mug.jpg";
import { useToast } from "@/hooks/use-toast";

// Mock product data
const productData = {
  "1": {
    id: "1",
    name: "Premium Organic Bananas",
    price: 4.99,
    originalPrice: 6.99,
    rating: 4.8,
    reviewCount: 124,
    image: productBanana,
    category: "Fruits",
    description: "Fresh, organic bananas sourced directly from sustainable farms. Rich in potassium and perfect for a healthy snack or smoothie ingredient.",
    features: [
      "Certified organic",
      "Rich in potassium and vitamins",
      "Sustainably sourced",
      "Perfect ripeness guaranteed"
    ],
    inStock: true,
    stockCount: 25,
  }
};

const relatedProducts = [
  {
    id: "2",
    name: "Fresh Red Apples",
    price: 7.99,
    rating: 4.6,
    reviewCount: 89,
    image: productApple,
    category: "Fruits",
    isNew: false,
    isFavorite: false,
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
    isFavorite: false,
  },
];

const reviews = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "/placeholder-avatar.jpg",
    rating: 5,
    date: "2 days ago",
    comment: "Amazing quality! The bananas were perfectly ripe and lasted longer than expected. Will definitely order again."
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "/placeholder-avatar.jpg",
    rating: 4,
    date: "1 week ago",
    comment: "Good quality bananas, though slightly more expensive than local stores. The organic certification is worth it."
  },
  {
    id: 3,
    user: "Emily Davis",
    avatar: "/placeholder-avatar.jpg",
    rating: 5,
    date: "2 weeks ago",
    comment: "Perfect for my morning smoothies! Fresh, sweet, and delivered quickly."
  }
];

export const ProductDetail = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const product = productData[id as keyof typeof productData];

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Redirecting to checkout",
      description: "Taking you to the checkout page...",
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: isFavorite ? "Item removed from your wishlist" : "Item added to your wishlist",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-rating text-rating' : 'text-muted-foreground'}`}
      />
    ));
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
            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <Badge className="mb-2">{product.category}</Badge>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground">{product.description}</p>

                <div>
                  <h3 className="font-semibold mb-2">Features:</h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stockCount} items available
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-favorite text-favorite' : ''}`} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Free Delivery</p>
                    <p className="text-xs text-muted-foreground">Orders over $50</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Quality Guarantee</p>
                    <p className="text-xs text-muted-foreground">100% fresh</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30-day policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{review.user}</h4>
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6">You may also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onAddToCart={() => console.log("Add to cart:", relatedProduct.id)}
                    onToggleFavorite={() => console.log("Toggle favorite:", relatedProduct.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};