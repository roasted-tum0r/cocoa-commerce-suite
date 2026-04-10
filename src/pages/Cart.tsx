import { useEffect, useState } from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Package, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import productHeadphones from "@/assets/product-headphones.jpg"; // Fallback image
import { appDispatch } from "@/redux/store";
import { fetchCart, deleteCartItems, updateCartItemQuantity } from "@/redux/thunks/cartthunk";
import { useAppSelector } from "@/redux/hooks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthModal } from "@/context/AuthModalContext";
import { AddressModal } from "@/components/Modals/AddressModal";

const CartItemQuantity = ({ cartItem, userId, isGuestCart }: any) => {
  const [tempQ, setTempQ] = useState(cartItem.quantity.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setTempQ(cartItem.quantity.toString());
  }, [cartItem.quantity]);

  const commitChange = async (newQuantity: number) => {
    if (newQuantity === cartItem.quantity || newQuantity < 1) return;
    setIsUpdating(true);
    await appDispatch(updateCartItemQuantity({
      itemId: cartItem.item.id,
      userId,
      isGuestCart,
      quantity: newQuantity
    }));
    appDispatch(fetchCart({ userId, isGuestCart }));
    setIsUpdating(false);
  }

  const handleMinus = () => {
    const q = Math.max(1, parseInt(tempQ) - 1);
    setTempQ(q.toString());
    commitChange(q);
  }

  const handlePlus = () => {
    const q = parseInt(tempQ) + 1;
    setTempQ(q.toString());
    commitChange(q);
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1 relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-background shadow-sm shrink-0"
        onClick={handleMinus}
        disabled={isUpdating || parseInt(tempQ) <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        className="w-10 h-8 text-center px-0 py-1 font-semibold text-sm bg-transparent border-none shadow-none focus-visible:ring-1"
        value={tempQ}
        onChange={(e) => setTempQ(e.target.value)}
        onBlur={() => {
          const q = parseInt(tempQ);
          if (isNaN(q) || q < 1) { setTempQ(cartItem.quantity.toString()); }
          else { commitChange(q); }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const q = parseInt(tempQ);
            if (isNaN(q) || q < 1) { setTempQ(cartItem.quantity.toString()); }
            else { commitChange(q); }
          }
        }}
        disabled={isUpdating}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-background shadow-sm shrink-0"
        onClick={handlePlus}
        disabled={isUpdating}
      >
        <Plus className="h-3 w-3" />
      </Button>
      {isUpdating && <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg backdrop-blur-[1px]"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>}
    </div>
  )
}

export const Cart = () => {
  const { guestUserId, items, loading, cartId } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [pendingAddress, setPendingAddress] = useState(false);
  const [pendingFormattedAddress, setPendingFormattedAddress] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (user && pendingAddress && pendingFormattedAddress) {
      setSavedAddress(pendingFormattedAddress);
      setPendingAddress(false);
      setPendingFormattedAddress(null);
    }
  }, [user, pendingAddress, pendingFormattedAddress]);

  useEffect(() => {
    appDispatch(
      fetchCart({
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
  }, [user, guestUserId]);

  const handleSaveAddress = (addressForm: any) => {
    const { houseNo, flatNo, streetName, landmark, city, state, country, zipcode } = addressForm;
    const formatted = `${houseNo} ${flatNo ? flatNo + ', ' : ''}${streetName}${landmark ? ", " + landmark : ""}, ${city}, ${state}, ${country} - ${zipcode}`;

    if (!user) {
      setPendingAddress(true);
      setPendingFormattedAddress(formatted);
      setIsAddressModalOpen(false);
      openAuthModal();
      return;
    }

    setSavedAddress(formatted);
    setIsAddressModalOpen(false);
  };
  // Placeholder functions for future implementation
  const cartItems = items || [];

  const handleToggleItem = (id: string) => {
    setSelectedItemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleAll = () => {
    if (selectedItemIds.length === cartItems.length && cartItems.length > 0) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map(i => i.item.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!cartId || selectedItemIds.length === 0) return;
    await appDispatch(deleteCartItems({ cartId, itemIds: selectedItemIds }));
    setSelectedItemIds([]);
    appDispatch(fetchCart({ userId: user?.id || guestUserId!, isGuestCart: !user }));
  };

  const handleClearCart = async () => {
    if (!cartId) return;
    await appDispatch(deleteCartItems({ cartId, itemIds: [] }));
    setSelectedItemIds([]);
    navigate("/");
  };

  const removeItem = async (id: string) => {
    if (!cartId) return;
    await appDispatch(deleteCartItems({ cartId, itemIds: [id] }));
    setSelectedItemIds(prev => prev.filter(i => i !== id));
    appDispatch(fetchCart({ userId: user?.id || guestUserId!, isGuestCart: !user }));
  };

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
            <div className="flex items-center gap-3">
              {cartItems.length > 0 && (
                <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              )}
              <Link to="/">
                <Button variant="outline" className="gap-2 group">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="hidden sm:inline">Continue Shopping</span>
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-8 space-y-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row gap-6 p-6">
                        <div className="shrink-0">
                          <Skeleton className="w-full sm:w-32 h-32 rounded-xl" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-h-[8rem]">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-3 w-full">
                              <Skeleton className="h-5 w-16" />
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="text-right space-y-2">
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 sm:mt-0">
                            <Skeleton className="h-10 w-32 rounded-lg" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Card className="border-none shadow-lg bg-primary/5 dark:bg-primary/10 overflow-hidden">
                    <CardHeader className="bg-primary/10 pb-6">
                      <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-16" /></div>
                        <div className="flex justify-between"><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-16" /></div>
                        <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-16" /></div>
                      </div>
                      <Separator className="bg-primary/20" />
                      <div className="flex justify-between items-end">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Skeleton className="w-full h-12 rounded-md" />
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          ) : <div>{cartItems.length === 0 ? (
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
                {cartItems.length > 0 && (
                  <div className="flex items-center justify-between bg-card/40 border px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedItemIds.length === cartItems.length && cartItems.length > 0}
                        onCheckedChange={handleToggleAll}
                      />
                      <span className="text-sm font-medium">Select All</span>
                    </div>
                    {selectedItemIds.length > 0 && (
                      <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                        Delete Selected ({selectedItemIds.length})
                      </Button>
                    )}
                  </div>
                )}
                {cartItems.map((cartItem) => (
                  <Card key={cartItem.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row gap-6 p-6">
                        {/* Checkbox and Image */}
                        <div className="shrink-0 flex items-center gap-4">
                          <Checkbox
                            className="mt-1 self-start sm:self-center"
                            checked={selectedItemIds.includes(cartItem.item.id)}
                            onCheckedChange={() => handleToggleItem(cartItem.item.id)}
                          />
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
                                <Link to={`/product/${cartItem.item.id}`} className="hover:text-primary transition-colors">
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
                            <CartItemQuantity
                              cartItem={cartItem}
                              userId={user?.id || guestUserId}
                              isGuestCart={!user}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(cartItem.item.id)}
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
                <div className="sticky top-24 space-y-6">
                  {/* Delivery Address Form */}
                  <Card className="border-none shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
                    <CardHeader className="bg-primary/5 py-4 border-b">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4 text-primary" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      {!savedAddress ? (
                        <div className="space-y-4 text-center py-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            No delivery address selected.
                          </p>
                          <Button
                            onClick={() => setIsAddressModalOpen(true)}
                            className="w-full font-medium shadow-sm hover:shadow-md transition-all"
                            variant="outline"
                          >
                            Add Address
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start gap-3 bg-primary/5 p-3 rounded-lg border border-primary/20">
                            <div className="shrink-0 mt-0.5">
                              <MapPin className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate text-foreground">Delivering to:</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{savedAddress}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddressModalOpen(true)}
                            className="w-full text-xs h-8 border-primary/20 hover:bg-primary/5"
                          >
                            Change Address
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

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
          </div>}
          <AddressModal
            open={isAddressModalOpen}
            onOpenChange={setIsAddressModalOpen}
            onSave={handleSaveAddress}
          />
        </div>
      </main>
    </div>
  );
};