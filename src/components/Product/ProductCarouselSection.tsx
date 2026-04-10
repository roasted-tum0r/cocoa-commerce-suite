import { useState, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ProductCard } from "@/components/Product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import { appDispatch } from "@/redux/store";
import { addToCart } from "@/redux/thunks/cartthunk";
import { InfiniteScrollModal } from "./InfiniteScrollModal";

interface ProductCarouselSectionProps {
  title: string;
  itemId: string;
  items: any[];
  loading: boolean;
  fetchEndpointThunk: any;
}

export const ProductCarouselSection = ({ title, itemId, items = [], loading, fetchEndpointThunk }: ProductCarouselSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { guestUserId } = useAppSelector((state) => state.cart);

  const handleAddToCart = useCallback((productId: string) => {
    appDispatch(
      addToCart({
        itemId: productId,
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
  }, [user, guestUserId]);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {items.length > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-semibold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
          >
            View All
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : (
        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-[16.6666%]">
                <ProductCard 
                  product={item} 
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={() => {}}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      <InfiniteScrollModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        itemId={itemId}
        fetchEndpointThunk={fetchEndpointThunk}
      />
    </div>
  );
};
