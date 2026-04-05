import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search, Filter, Loader2, Frown } from "lucide-react";
import axiosInstance from "@/interceptors/apiInterceptor";
import { API_ENDPOINTS } from "@/utility/endpoints";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/thunks/cartthunk";

export const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Auth & Redux
    const { user } = useAppSelector((state) => state.auth);
    const { guestUserId } = useAppSelector((state) => state.cart);
    const searchPagination = useAppSelector((state) => state.home?.searchProducts?.pagination) || { page: 1, limit: 100, isAsc: true, sortBy: "name" };
    const appDispatch = useAppDispatch();

    // Query Params State
    const querySearch = searchParams.get("q") || "";
    // Parse categoryIds, could be multiple: e.g. ?categoryIds=123,456
    const queryCategoryIdsParam = searchParams.get("categoryIds");
    const queryCategoryIds = queryCategoryIdsParam ? queryCategoryIdsParam.split(",") : [];
    
    const queryMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : "";
    const queryMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : "";
    const queryIsAvailable = searchParams.get("isAvailable") !== "false"; // Default true unless explicitly false

    // Local form state for top search bar
    const [searchInput, setSearchInput] = useState(querySearch);
    
    // Local state for sidebar filters (avoiding refetch on every keystroke, fetching on blur/submit)
    const [localMinPrice, setLocalMinPrice] = useState<string | number>(queryMinPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState<string | number>(queryMaxPrice);

    // Sync local states if URL changes externally
    useEffect(() => {
        setSearchInput(querySearch);
        setLocalMinPrice(queryMinPrice);
        setLocalMaxPrice(queryMaxPrice);
    }, [querySearch, queryMinPrice, queryMaxPrice]);

    // Handlers to update URL
    const updateSearchParams = (key: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateSearchParams("q", searchInput.trim() || null);
    };

    const handleCategoryToggle = (categoryId: string) => {
        let newIds = [...queryCategoryIds];
        if (newIds.includes(categoryId)) {
            newIds = newIds.filter(id => id !== categoryId);
        } else {
            newIds.push(categoryId);
        }
        updateSearchParams("categoryIds", newIds.length > 0 ? newIds.join(",") : null);
    };

    const applyPriceFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        if (localMinPrice !== "" && Number(localMinPrice) >= 0) {
            newParams.set("minPrice", localMinPrice.toString());
        } else {
            newParams.delete("minPrice");
        }
        
        if (localMaxPrice !== "" && Number(localMaxPrice) >= 0) {
            newParams.set("maxPrice", localMaxPrice.toString());
        } else {
            newParams.delete("maxPrice");
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams(querySearch ? { q: querySearch } : {}));
    };

    const handleAddToCart = (productId: string) => {
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
        // Toggle favorite logic
    };

    // Queries
    // 1. Fetch Categories
    const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.FIND_ALL, {
                limit: 100, // Fetch all for sidebar
                page: 1,
                isAsc: true,
                sortBy: "name",
            });
            return res.data;
        },
    });
    
    const categories = categoriesData?.results || [];

    // 2. Fetch Products
    const { data: productsData, isLoading: isLoadingProducts, isFetching: isFetchingProducts, isError } = useQuery({
        queryKey: ["products", querySearch, queryCategoryIds, queryMinPrice, queryMaxPrice, queryIsAvailable, searchPagination.page, searchPagination.limit, searchPagination.sortBy, searchPagination.isAsc],
        queryFn: async () => {
            const res = await axiosInstance.get(
                API_ENDPOINTS.PRODUCTS.LIST({
                    search: querySearch || undefined,
                    categoryIds: queryCategoryIds.length > 0 ? queryCategoryIds : undefined,
                    minPrice: queryMinPrice !== "" ? Number(queryMinPrice) : undefined,
                    maxPrice: queryMaxPrice !== "" ? Number(queryMaxPrice) : undefined,
                    limit: searchPagination.limit,
                    page: searchPagination.page, // Controlled via Redux for future infinite scroll
                    isAsc: searchPagination.isAsc,
                    sortBy: searchPagination.sortBy,
                    isAvailable: queryIsAvailable,
                })
            );
            return res.data;
        },
    });

    const products = productsData?.results || [];

    return (
        <div className="min-h-screen bg-gradient-secondary flex flex-col">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4 flex justify-end">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Sticky Sidebar for Filters */}
                    <aside className="hidden lg:block w-80 sticky top-24 shrink-0">
                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">Filters</CardTitle>
                                    {(queryCategoryIds.length > 0 || queryMinPrice !== "" || queryMaxPrice !== "" || !queryIsAvailable) && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={clearFilters}
                                            className="text-muted-foreground h-auto p-0 hover:bg-transparent hover:text-primary transition-colors text-xs font-semibold"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                {/* Availability */}
                                <div>
                                    <Label className="text-sm font-bold mb-4 block text-foreground uppercase tracking-wider">Availability</Label>
                                    <div className="flex items-center space-x-3 group">
                                        <Checkbox 
                                            id="filter-available" 
                                            checked={queryIsAvailable}
                                            onCheckedChange={(checked) => updateSearchParams("isAvailable", checked ? "true" : "false")}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <label 
                                            htmlFor="filter-available"
                                            className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors"
                                        >
                                            In Stock Only
                                        </label>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <Label className="text-sm font-bold mb-4 block text-foreground uppercase tracking-wider">Categories</Label>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {isLoadingCategories ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            </div>
                                        ) : (
                                            categories.map((cat: any) => (
                                                <div key={cat.id} className="flex items-center space-x-3 group">
                                                    <Checkbox 
                                                        id={`category-${cat.id}`} 
                                                        checked={queryCategoryIds.includes(cat.id)}
                                                        onCheckedChange={() => handleCategoryToggle(cat.id)}
                                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                    />
                                                    <label 
                                                        htmlFor={`category-${cat.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-primary transition-colors flex-1"
                                                    >
                                                        {cat.name}
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <Label className="text-sm font-bold mb-4 block text-foreground uppercase tracking-wider">
                                        Price Range
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none font-medium text-sm">$</span>
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                min="0"
                                                value={localMinPrice}
                                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                                onBlur={applyPriceFilter}
                                                onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                                                className="pl-7 h-10 bg-muted/40 focus:bg-background border-transparent hover:border-border transition-colors font-medium"
                                            />
                                        </div>
                                        <span className="text-muted-foreground font-medium">-</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none font-medium text-sm">$</span>
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                min="0"
                                                value={localMaxPrice}
                                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                                onBlur={applyPriceFilter}
                                                onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                                                className="pl-7 h-10 bg-muted/40 focus:bg-background border-transparent hover:border-border transition-colors font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Right Results Area */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Sticky Search Bar */}
                        <div className="sticky top-[80px] z-[40] bg-background/95 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b sm:border-b-0">
                            <form onSubmit={handleSearchSubmit} className="relative max-w-4xl w-full group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search for chocolates, gifts, and more..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full h-14 pl-14 pr-24 rounded-2xl text-lg border-2 border-muted 
                                             focus-visible:ring-0 focus-visible:border-primary bg-card/50 hover:bg-card
                                             shadow-sm transition-all"
                                />
                                <div className="absolute inset-y-0 right-2 flex items-center">
                                    <Button 
                                        type="submit" 
                                        className="rounded-xl px-6 font-semibold shadow-md shrink-0 h-10"
                                    >
                                        Search
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Top Info Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-1">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground inline-flex items-center gap-2">
                                    {querySearch ? <span>Results for <span className="text-primary">"{querySearch}"</span></span> : 'All Products'}
                                </h1>
                                <p className="text-muted-foreground text-sm mt-1 font-medium">
                                    Showing {products.length} products
                                </p>
                            </div>

                            {/* Active Filters Display */}
                            <div className="flex flex-wrap gap-2">
                                {querySearch && (
                                    <Badge variant="secondary" className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-colors">
                                        Keyword: {querySearch}
                                        <button onClick={() => updateSearchParams("q", null)} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                                           <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {!queryIsAvailable && (
                                    <Badge variant="secondary" className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-full">
                                        Include Out of Stock
                                        <button onClick={() => updateSearchParams("isAvailable", "true")} className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors">
                                           <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {queryCategoryIds.map((id) => {
                                    const cat = categories.find((c: any) => c.id === id);
                                    if (!cat) return null;
                                    return (
                                        <Badge key={id} variant="secondary" className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-full">
                                            {cat.name}
                                            <button onClick={() => handleCategoryToggle(id)} className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors">
                                               <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                                {(queryMinPrice !== "" || queryMaxPrice !== "") && (
                                    <Badge variant="secondary" className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-full">
                                        Price: {queryMinPrice ? `$${queryMinPrice}` : `$0`} - {queryMaxPrice ? `$${queryMaxPrice}` : 'Any'}
                                        <button 
                                            className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.delete("minPrice");
                                                newParams.delete("maxPrice");
                                                setSearchParams(newParams);
                                            }}
                                        >
                                           <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Results Grid State */}
                        {(isLoadingProducts && !productsData) || isFetchingProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-card border rounded-2xl shadow-sm h-[380px] w-full overflow-hidden flex flex-col">
                                        <div className="h-48 bg-muted w-full shrink-0"></div>
                                        <div className="p-5 space-y-4 flex-1">
                                            <div className="h-5 bg-muted rounded-md w-1/3"></div>
                                            <div className="h-5 bg-muted rounded-md w-full"></div>
                                            <div className="h-6 bg-muted rounded-md w-1/4 mt-4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border shadow-sm px-4">
                                <div className="bg-destructive/10 p-5 rounded-full mb-6 text-destructive">
                                    <Frown className="h-10 w-10" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Oops! Something went wrong</h2>
                                <p className="text-muted-foreground mb-8 text-lg max-w-md">We couldn't fetch your search results right now. Please try again.</p>
                                <Button size="lg" onClick={() => window.location.reload()} className="rounded-full px-8 shadow-md">Try Again</Button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-28 text-center bg-card rounded-3xl border border-dashed shadow-sm px-4">
                                <div className="bg-muted p-5 rounded-full mb-6">
                                    <Search className="h-10 w-10 text-muted-foreground mx-auto" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">No products found</h2>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                                    We couldn't find anything matching your current filters. Try adjusting your search query or clear existing filters to see more results.
                                </p>
                                <Button 
                                    size="lg"
                                    onClick={clearFilters}
                                    variant="outline"
                                    className="rounded-full px-8 border-2 hover:bg-muted/50 transition-all font-semibold"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                                {products.map((product: any) => (
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
                </div>
            </main>

            <Footer />
        </div>
    );
};