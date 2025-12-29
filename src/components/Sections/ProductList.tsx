import React from "react";
import { ProductCard } from "../Product/ProductCard";
import { ProductsListProps } from "@/redux/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { fetchLatestProducts } from "@/redux/thunks/homethunk";

const ProductsList: React.FC<ProductsListProps> = ({
  onAddToCart,
  onToggleFavorite,
  title = "Featured Products",
}) => {
  const appDispatch = useAppDispatch();
  const { latestProducts, loading } = useAppSelector(
    (state: RootState) => state.home
  );
  const { items, pagination } = latestProducts;

  React.useEffect(() => {
    appDispatch(fetchLatestProducts(pagination));
  }, []);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>

        {/* Show Skeletons while loading */}
        {pagination.loading && items.length == 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md h-72"
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !pagination.loading && items.length == 0 ? (
          <div className="text-center text-gray-500 py-10">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsList;
