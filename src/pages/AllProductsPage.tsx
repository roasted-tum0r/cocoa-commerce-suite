import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";
import ProductsList from "@/components/Sections/ProductList";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/thunks/cartthunk";
import { appDispatch } from "@/redux/store";

export const AllProductsPage = () => {
    const navigate = useNavigate();
    const { lastPath } = useAppSelector((state) => state.home);
    const { user } = useAppSelector((state) => state.auth);
    const { guestUserId } = useAppSelector((state) => state.cart);

    const handleBack = () => {
        if (lastPath) {
            navigate(lastPath);
        } else {
            navigate("/");
        }
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
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="gap-2 hover:bg-transparent hover:text-primary pl-0"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold mt-4">All Products</h1>
                    <p className="text-muted-foreground mt-2">
                        Explore our complete collection of premium products.
                    </p>
                </div>

                <ProductsList
                    title=""
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                />
            </main>

            <Footer />
        </div>
    );
};
