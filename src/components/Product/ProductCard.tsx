import { useState } from "react";
import { Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardProps } from "@/redux/types";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { setLastPath } from "@/redux/reducers/homereducer";

export const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const discountPercentage = product.price
    ? Math.round(((product.price - product.price) / product.price) * 100)
    : 0;

  const { cartInfo } = useAppSelector((state) => state.cart);

  // ✅ Find the item in the cart
  const cartItem = cartInfo?.find((item) => item.itemId === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const [imageSrc, setImageSrc] = useState(product.image);

  const handleImageError = () => {
    // Fallback to a generated image based on product name if original fails
    setImageSrc(`https://loremflickr.com/400/400/${encodeURIComponent(product.category?.name || "product")},${encodeURIComponent(product.name)}/all`);
  };

  const handleCardClick = () => {
    dispatch(setLastPath(location.pathname));
    navigate(`/product/${encodeURIComponent(product.name)}`);
  };

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-product transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={product.name}
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.createdAt && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive">-{discountPercentage}%</Badge>
            )}
          </div>

          {/* 🛒 Add to Cart OR Quantity Controls */}
          <div
            className={`
    absolute inset-x-2 bottom-2 
    transition-opacity duration-300 
    opacity-0 group-hover:opacity-100
  `}
          >
            <Button
              className="w-full bg-cart hover:bg-cart/90 text-cart-foreground rounded-lg shadow-lg"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product.id);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          </div>

          <h3 className="font-medium text-sm mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating)
                    ? "fill-rating text-rating"
                    : "text-muted-foreground"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews.length})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
