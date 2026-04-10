import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductCard } from "@/components/Product/ProductCard";
import { Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/thunks/cartthunk";
import { appDispatch } from "@/redux/store";

interface InfiniteScrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemId: string;
  fetchEndpointThunk: any;
}

export const InfiniteScrollModal = ({ isOpen, onClose, title, itemId, fetchEndpointThunk }: InfiniteScrollModalProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

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

  const handleToggleFavorite = useCallback((productId: string) => {
    console.log("Toggle favorite:", productId);
  }, []);

  const loadMore = async (currentPage: number) => {
    if (loading || !hasMore || !itemId) return;
    try {
      setLoading(true);
      const data: any = await dispatch(fetchEndpointThunk({ 
        id: itemId, 
        pagination: { limit: 50, page: currentPage, sortBy: 'name', isAsc: true } 
      })).unwrap();
      const newItems = data.items || [];
      
      setItems((prev) => currentPage === 1 ? newItems : [...prev, ...newItems]);
      
      if (newItems.length < 50) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadMore(1);
    }
  }, [isOpen, fetchEndpointThunk, itemId]);

  const onScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadMore(nextPage);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div 
          className="flex-1 overflow-y-auto p-6"
          ref={scrollContainerRef}
          onScroll={onScroll}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <ProductCard 
                key={`${item.id}-${index}`} 
                product={item} 
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {!hasMore && items.length > 0 && (
            <div className="text-center text-muted-foreground py-8">
              You've reached the end of the list.
            </div>
          )}
          
          {!loading && items.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No products available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
