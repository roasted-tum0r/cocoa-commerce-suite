import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export const FeaturedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-10 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Featured Collection</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover our hand-picked selection of premium products, curated just for you.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-3xl bg-muted/30">
                <p className="text-xl text-muted-foreground mb-6">Featured products coming soon!</p>
                <Button onClick={() => navigate('/products')}>Browse All Products</Button>
            </div>
        </div>
    );
};
