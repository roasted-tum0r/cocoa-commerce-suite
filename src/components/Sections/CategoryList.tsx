import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchCategories } from "@/redux/thunks/homethunk";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  variant?: "home" | "details";
}

export const CategoryList = ({ variant = "home" }: CategoryListProps) => {
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories } = useAppSelector((state: RootState) => state.home);
  const { items, pagination } = categories;

  React.useEffect(() => {
    if (items.length === 0) {
        appDispatch(fetchCategories(pagination));
    }
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/categories?type=${encodeURIComponent(categoryName)}`);
  };

  // 1️⃣ Loading state
  if (pagination.loading && items.length === 0) {
    return (
      <div className={cn("grid gap-6", variant === "home" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4")}>
        {Array.from({ length: variant === "home" ? 4 : 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
                "mx-auto p-6 border bg-card animate-pulse flex flex-col items-center justify-center space-y-3",
                variant === "home" ? "w-40 h-40 rounded-full" : "w-full h-48 rounded-xl"
            )}
          >
            <Skeleton className={variant === "home" ? "w-12 h-12 rounded-full" : "w-16 h-16 rounded-md"} />
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-10 h-3" />
          </div>
        ))}
      </div>
    );
  }

  // 2️⃣ Empty state
  if (!pagination.loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-muted/30 text-center space-y-6">
        <div className="text-6xl">🌀</div>
        <h3 className="text-2xl font-semibold text-foreground">
          No Categories Yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          It looks a little empty here! Add some categories to get started.
        </p>
        <Button variant="outline" className="flex items-center" onClick={() => appDispatch(fetchCategories(pagination))}>
          Refresh
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  // 3️⃣ Normal (data loaded)
  const displayedItems = variant === "home" ? items.slice(0, 7) : items;

  return (
    <div className="w-full">
      {/* MAIN ROW */}
      <div className={cn("grid gap-4", variant === "home" ? "grid-cols-2 md:grid-cols-7" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
        {displayedItems.map((category) => (
          <div
            key={category.name}
            className="group flex flex-col items-center cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            {/* Icon Container */}
            <div
              className={cn(
                "p-4 border bg-card transition-all duration-300 group-hover:border-primary flex items-center justify-center shadow-sm relative overflow-hidden",
                variant === "home" 
                    ? "w-24 h-24 md:w-28 md:h-28 rounded-full group-hover:scale-105" 
                    : "w-full aspect-square rounded-xl group-hover:-translate-y-1"
              )}
            >
               {/* Placeholder for image - can be replaced with actual image if available */}
               <div className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                 {category.name.charAt(0).toUpperCase()}
               </div>
            </div>

            {/* Text Content */}
            <div className="mt-3 text-center">
              <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
