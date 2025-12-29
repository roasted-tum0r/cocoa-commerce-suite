import React from "react";
import { Navbar } from "@/components/Layout/Navbar";
import { CategoryList } from "@/components/Sections/CategoryList";
import { useSearchParams } from "react-router-dom";
import { CategoryDetail } from "@/components/Sections/CategoryDetail";

const CategoriesPage = () => {
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get("type");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {categoryType ? (
            <CategoryDetail categoryName={categoryType} />
        ) : (
            <>
                <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">All Categories</h1>
                <p className="text-muted-foreground mt-2">
                    Explore our wide range of premium products by category.
                </p>
                </div>
                
                <CategoryList variant="details" />
            </>
        )}
      </main>
    </div>
  );
};

export default CategoriesPage;
