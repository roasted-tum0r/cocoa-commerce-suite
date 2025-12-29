import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/thunks/cartthunk";
import { appDispatch } from "@/redux/store";

export const ProductDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { lastPath, latestProducts } = useAppSelector((state) => state.home);
  const { user } = useAppSelector((state) => state.auth);
  const { guestUserId } = useAppSelector((state) => state.cart);

  // Find product by name (decode URI component first)
  const decodedName = decodeURIComponent(name || "");
  const product = latestProducts.items.find(p => p.name === decodedName);

  // Fallback image logic
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (product) {
      setImageSrc(product.image);
    }
  }, [product]);

  const handleImageError = () => {
    if (product) {
      setImageSrc(`https://loremflickr.com/600/600/${encodeURIComponent(product.category?.name || "product")},${encodeURIComponent(product.name)}/all`);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const handleBack = () => {
    if (lastPath) {
      navigate(lastPath);
    } else {
      navigate("/");
    }
  };

  const handleAddToCart = () => {
    appDispatch(
      addToCart({
        itemId: product.id,
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
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
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 gap-2 hover:bg-transparent hover:text-primary pl-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {lastPath === "/" ? "Home" : "Products"}
            </Button>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg relative group">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-md" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Link copied", description: "Product link copied to clipboard" });
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="px-3 py-1 text-sm">{product.category?.name || "Category"}</Badge>
                    {product.createdAt && <Badge className="bg-green-500 hover:bg-green-600">New Arrival</Badge>}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews.length} verified reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-4 border-b pb-8">
                  <span className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.price && (
                    <div className="flex flex-col mb-1">
                      <span className="text-lg text-muted-foreground line-through decoration-2">
                        ${(product.price * 1.2).toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-500">
                        Save 20%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description || "Experience premium quality with this exceptional product. Designed for durability and style, it's the perfect addition to your collection."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center border-2 rounded-xl bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-l-xl hover:bg-muted"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-r-xl hover:bg-muted"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    className="flex-1 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1 h-12 text-lg font-semibold rounded-xl"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-2"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <Truck className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-xs text-muted-foreground mt-1">On orders over $50</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <Shield className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">2 Year Warranty</p>
                    <p className="text-xs text-muted-foreground mt-1">Full coverage</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <RotateCcw className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">30 Days Return</p>
                    <p className="text-xs text-muted-foreground mt-1">No questions asked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {product.reviews.map((review, index) => (
                  <Card key={index} className="bg-muted/20 border-none shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{review.user?.name || "Anonymous"}</h4>
                          <div className="flex mt-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
                {product.reviews.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};