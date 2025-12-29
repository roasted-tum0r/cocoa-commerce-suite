import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Bell, User, Heart, Menu, Package, Tag, Star, TrendingUp, Gift, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { appDispatch, RootState } from "@/redux/store";
import { fetchCart } from "@/redux/thunks/cartthunk";
import { useAppSelector } from "@/redux/hooks";
import { useAuthModal } from "@/context/AuthModalContext";
import { cn } from "@/lib/utils";
import { fetchCategories } from "@/redux/thunks/homethunk";
import { logout } from "@/redux/reducers/authreducer";
import { NotificationModal } from "../Modals/NotificationModal";
import { useTheme } from "../theme-provider";
import { createPortal } from "react-dom";

interface NavbarProps {
  onMenuClick?: () => void;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFloatingSearch, setShowFloatingSearch] = useState(false);
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowFloatingSearch(false);
    }
  };

  const handleLogout = () => {
    appDispatch(logout());
    navigate("/");
  };

  const { cartCount } = useAppSelector((state: RootState) => state.cart);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { categories } = useAppSelector((state: RootState) => state.home);

  useEffect(() => {
    appDispatch(fetchCart(null));
    if (categories.items.length === 0) {
      appDispatch(fetchCategories({ page: 1, limit: 10, loading: false, totalPages: 0, totalItems: 0 }));
    }
  }, []);

  const dummySuggestions = [
    "Dark Chocolate", "Truffles", "Gift Box", "Vegan Chocolate", "Hot Cocoa"
  ];

  const { theme, setTheme } = useTheme();

  const gradientTextStyle = "bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-bold";
  const glassButtonStyle = "bg-white/50 backdrop-blur-md hover:bg-white/80 border border-white/20 shadow-sm transition-all duration-300";
  const navItemStyle = cn(navigationMenuTriggerStyle(), glassButtonStyle, gradientTextStyle, "data-[active]:bg-white/80 data-[state=open]:bg-white/80");

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-navbar/95 backdrop-blur supports-[backdrop-filter]:bg-navbar/60">
      {/* SVG Gradient Definition for Icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side - Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Logo (Trigger for Menu) */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">CC</span>
                    </div>
                    <span className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                      CocoaCommerce
                    </span>
                  </div>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-6 py-6">
                    <div className="flex items-center gap-2" onClick={() => navigate("/")}>
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">CC</span>
                      </div>
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        CocoaCommerce
                      </span>
                    </div>
                    <nav className="flex flex-col gap-4">
                      <Link to="/categories" className="text-lg font-medium hover:text-primary transition-colors">
                        All Categories
                      </Link>
                      <Link to="/products" className="text-lg font-medium hover:text-primary transition-colors">
                        All Products
                      </Link>
                      <Link to="/featured" className="text-lg font-medium hover:text-primary transition-colors">
                        Featured
                      </Link>
                      <Link to="/new-arrivals" className="text-lg font-medium hover:text-primary transition-colors">
                        New Arrivals
                      </Link>
                      <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                        Contact Us
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Logo (Link to Home) */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  CC
                </span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                CocoaCommerce
              </span>
            </div>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {/* All Categories Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={navItemStyle}>All Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/categories"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/categories`);
                            }}
                          >
                            <Package className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Browse All
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              View all available categories.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {categories.items.slice(0, 4).map((category) => (
                        <ListItem
                          key={category.name}
                          title={category.name}
                          href={`/category/${category.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/category/${category.id}`);
                          }}
                        >
                          Explore our {category.name} collection.
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* All Products Mega Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={navItemStyle}>All Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/products"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/products`);
                            }}
                          >
                            <Package className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Browse All
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore our entire catalog of premium products.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/products?sort=price_asc" title="Lowest Prices" onClick={(e) => { e.preventDefault(); navigate('/products?sort=price_asc') }}>
                        <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-500" /> Budget friendly options</div>
                      </ListItem>
                      <ListItem href="/products?sort=rating" title="Famous Products" onClick={(e) => { e.preventDefault(); navigate('/products?sort=rating') }}>
                        <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Top rated by customers</div>
                      </ListItem>
                      <ListItem href="/products?sort=popular" title="Frequently Bought" onClick={(e) => { e.preventDefault(); navigate('/products?sort=popular') }}>
                        <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" /> Trending now</div>
                      </ListItem>
                      <ListItem href="/offers" title="BOGO Offers" onClick={(e) => { e.preventDefault(); navigate('/offers') }}>
                        <div className="flex items-center gap-2"><Gift className="w-4 h-4 text-pink-500" /> Buy One Get One</div>
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/featured">
                    <NavigationMenuLink className={navItemStyle}>
                      Featured
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/new-arrivals">
                    <NavigationMenuLink className={navItemStyle}>
                      New Arrivals
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navItemStyle}>
                      Contact Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(navItemStyle, "h-10 w-10 px-0 relative")}
              onClick={() => setShowFloatingSearch(!showFloatingSearch)}
            >
              <Search className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
            </Button>

            {/* Floating Search Overlay */}
            {showFloatingSearch && createPortal(
              <>
                {/* 1. BACKDROP 
      - z-index set to 50 to sit above standard navbars (usually z-40 or z-50).
      - This covers the WHOLE screen, ignoring parent padding/margins.
    */}
                <div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[50]"
                  onClick={() => setShowFloatingSearch(false)}
                />

                {/* 2. SEARCH CONTAINER 
      - z-index 51 to sit on top of the backdrop
    */}
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl bg-background border rounded-xl shadow-2xl z-[51] p-4 animate-in fade-in zoom-in-95 duration-200">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      autoFocus
                      placeholder="Search for chocolates, gifts, and more..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-lg bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all rounded-lg"
                    />
                  </form>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {dummySuggestions.map((suggestion) => (
                        <Badge
                          key={suggestion}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1 px-3"
                          onClick={() => setSearchQuery(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>,
              document.body // <--- This forces it to render at the very end of the HTML body
            )}

            {/* Favorites */}
            <Link to="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={cn(navItemStyle, "h-10 w-10 px-0 relative")}
              >
                <Heart className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                >
                  3
                </Badge>
              </Button>
            </Link>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(navItemStyle, "h-10 w-10 px-0 relative")}
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                5
              </Badge>
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className={cn(navItemStyle, "h-10 w-10 px-0 relative")}>
                <ShoppingCart className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-cart text-cart-foreground">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(navItemStyle, "h-10 w-10 px-0 relative")}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" style={{ stroke: "url(#icon-gradient)" }} />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" style={{ stroke: "url(#icon-gradient)" }} />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Profile / Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn(navItemStyle, "h-10 px-2 rounded-md gap-2")}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={user.name || "User"} />
                      <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.name && <p className="font-medium">{user.name}</p>}
                      {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center cursor-pointer">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => openAuthModal()} className={cn(navItemStyle, "h-10 w-10 px-0")}>
                <User className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />
    </nav>
  );
};
