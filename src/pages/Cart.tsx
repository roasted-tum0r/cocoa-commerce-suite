import { useEffect } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import productHeadphones from "@/assets/product-headphones.jpg"; // Fallback image
import { appDispatch } from "@/redux/store";
import { fetchCart } from "@/redux/thunks/cartthunk";
import { useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";

export const Cart = () => {
  const { guestUserId, items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    appDispatch(
      fetchCart({
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
  }, [user, guestUserId]);

  // Placeholder functions for future implementation
  const updateQuantity = (id: string, change: number) => {
    console.log("Update quantity not implemented yet", id, change);
    // TODO: Dispatch update quantity action
  };

  const removeItem = (id: string) => {
    console.log("Remove item not implemented yet", id);
    // TODO: Dispatch remove item action
  };

  const cartItems = items || [];
  const subtotal = cartItems.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={() => { }} />

      <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                You have <span className="font-medium text-foreground">{cartItems.length}</span> items in your cart
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2 group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed">
              <div className="bg-background p-6 rounded-full shadow-sm mb-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Looks like you haven't added anything to your cart yet.
                Explore our products and find something you love!
              </p>
              <Link to="/">
                <Button size="lg" className="gap-2">
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-6">
                {cartItems.map((cartItem) => (
                  <Card key={cartItem.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row gap-6 p-6">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-muted relative group">
                            <img
                              src={cartItem.item.images && cartItem.item.images.length > 0 ? cartItem.item.images[0] : productHeadphones}
                              alt={cartItem.item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between min-h-[8rem]">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-[10px] px-2 h-5">
                                  Product
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold leading-tight mb-1">
                                <Link to={`/product/${encodeURIComponent(cartItem.item.name)}`} className="hover:text-primary transition-colors">
                                  {cartItem.item.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {cartItem.item.description || "Premium quality product"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                              {cartItem.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">${cartItem.item.price.toFixed(2)} each</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 sm:mt-0">
                            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-background shadow-sm"
                                onClick={() => updateQuantity(cartItem.id, -1)}
                                disabled={cartItem.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold text-sm">{cartItem.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-background shadow-sm"
                                onClick={() => updateQuantity(cartItem.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(cartItem.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Card className="border-none shadow-lg bg-primary/5 dark:bg-primary/10 overflow-hidden">
                    <CardHeader className="bg-primary/10 pb-6">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping Estimate</span>
                          <span className="font-medium">
                            {shipping === 0 ? <span className="text-green-600 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax Estimate</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                      </div>

                      <Separator className="bg-primary/20" />

                      <div className="flex justify-between items-end">
                        <span className="text-base font-semibold">Order Total</span>
                        <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                      </div>

                      {shipping > 0 && (
                        <div className="bg-background/50 p-3 rounded-lg border border-primary/20 text-xs text-muted-foreground text-center">
                          Add <span className="font-bold text-primary">${(100 - subtotal).toFixed(2)}</span> more to unlock <span className="font-bold text-green-600">FREE Shipping</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};