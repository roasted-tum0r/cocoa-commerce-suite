import React, { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchLatestProducts } from "@/redux/thunks/homethunk";
import { ProductCard } from "../Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/redux/thunks/cartthunk";

interface CategoryDetailProps {
    categoryName: string;
}

export const CategoryDetail = ({ categoryName }: CategoryDetailProps) => {
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    // Get categories to find the ID
    const { categories, latestProducts } = useAppSelector((state: RootState) => state.home);
    const { items: categoryItems } = categories;
    const { items: products, pagination: productPagination } = latestProducts;
    const { user } = useAppSelector((state: RootState) => state.auth);

    // Find the category object
    const category = useMemo(() => {
        return categoryItems.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    }, [categoryItems, categoryName]);

    useEffect(() => {
        if (category) {
            // Fetch products for this category
            appDispatch(fetchLatestProducts({
                categoryIds: [category.id],
                page: 1,
                limit: 20
            }));
        }
    }, [category, appDispatch]);

    const handleAddToCart = (productId: string) => {
        appDispatch(addToCart({
            itemId: productId,
            isGuestCart: !user,
            userId: user?.id
        }));
    };

    const handleToggleFavorite = (productId: string) => {
        // appDispatch(toggleFavorite(productId)); // Implement if available
        console.log("Toggle favorite", productId);
    };

    if (!category && !categories.pagination.loading) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Category Not Found</h2>
                <Button variant="link" onClick={() => navigate("/categories")}>Back to Categories</Button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-10 bg-primary/5">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-primary">
                        {category?.name || categoryName}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Explore our premium collection of {category?.name || categoryName}.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => navigate("/categories")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Categories
            </Button>

            {/* Products Grid */}
            {productPagination.loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-96 rounded-2xl border bg-card animate-pulse p-4 space-y-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 border rounded-3xl bg-muted/30">
                    <p className="text-xl text-muted-foreground">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
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
    );
};
