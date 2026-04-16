import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Layout/Navbar";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Share2, Paperclip, X, Film, ImageIcon, MoreVertical, Edit, Trash2, CheckCircle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ModernImage } from "@/components/ui/ModernImage";
import { addToCart } from "@/redux/thunks/cartthunk";
import { appDispatch } from "@/redux/store";
import { ProductCarouselSection } from "@/components/Product/ProductCarouselSection";
import { Textarea } from "@/components/ui/textarea";
import { fetchProductDetails, fetchProductReviews, fetchAlsoBoughtItems, fetchAlsoLikeItems, fetchSimilarItems, submitProductReview, uploadMedia, deleteProductReview, updateProductReview, deleteMediaFiles } from "@/redux/thunks/productthunk";
import { clearProductState } from "@/redux/reducers/productreducer";
import { ImageViewer } from "@/components/ui/image-viewer";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const state = useAppSelector((state) => state.product);
  const { productDetails: product, reviews: { items: reviews }, loading, error } = state;

  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMediaFiles, setReviewMediaFiles] = useState<File[]>([]);
  const [reviewMediaPreviews, setReviewMediaPreviews] = useState<{ url: string, type: string, name: string, size: number }[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewerImages, setViewerImages] = useState<{ url: string, type?: string }[]>([]);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerAuthor, setViewerAuthor] = useState<string>("");
  const [viewerContent, setViewerContent] = useState<string>("");

  // Edit Review State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [editExistingImages, setEditExistingImages] = useState<{ publicId: string, url: string }[]>([]);
  const [editImagesToDelete, setEditImagesToDelete] = useState<string[]>([]);
  const [editNewMediaFiles, setEditNewMediaFiles] = useState<File[]>([]);
  const [editNewMediaPreviews, setEditNewMediaPreviews] = useState<{ url: string, type: string, name: string, size: number }[]>([]);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isUploadingEditMedia, setIsUploadingEditMedia] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const openImageViewer = (review: any, index: number) => {
    const media = (review.images || []).map((img: any) => {
      if (typeof img === 'string') return { url: img };
      return { url: img.imageUrl || img.url, type: img.type };
    });
    setViewerImages(media);
    setViewerInitialIndex(index);
    setViewerAuthor(review.user?.firstname ? `${review.user.firstname} ${review.user.lastname || ''}` : "Anonymous");
    setViewerContent(review.content || "");
    setIsViewerOpen(true);
  };

  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { lastPath } = useAppSelector((state) => state.home);
  const { user } = useAppSelector((state) => state.auth);
  const { guestUserId } = useAppSelector((state) => state.cart);

  const userHasReviewed = user && reviews.some((review: any) => review.userId === user.id || review.user?.id === user.id);

  useEffect(() => {
    if (!id) return;

    // Clear old state before fetching new
    dispatch(clearProductState());

    // Fetch base
    dispatch(fetchProductDetails(id));
    dispatch(fetchProductReviews({ id, pagination: { page: 1, limit: 10, sortBy: 'createdAt', isAsc: false } as any }));

    // Fetch Recommendations
    const payload = { page: 1, limit: 6, sortBy: 'name', isAsc: true };
    dispatch(fetchSimilarItems({ id, pagination: payload as any }));
    dispatch(fetchAlsoLikeItems({ id, pagination: payload as any }));
    dispatch(fetchAlsoBoughtItems({ id, pagination: payload as any }));
  }, [id, dispatch]);

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = [...reviewMediaFiles, ...files].slice(0, 5);
    setReviewMediaFiles(newFiles);

    // Create new previews
    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      size: file.size,
    }));

    // Revoke old previews to avoid memory leaks
    reviewMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setReviewMediaPreviews(newPreviews);
  };

  const removeMediaFile = (index: number) => {
    const newFiles = reviewMediaFiles.filter((_, i) => i !== index);
    const newPreviews = reviewMediaPreviews.filter((_, i) => i !== index);
    setReviewMediaFiles(newFiles);
    setReviewMediaPreviews(newPreviews);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearMediaFile = () => {
    setReviewMediaFiles([]);
    reviewMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setReviewMediaPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitReview = async () => {
    let imagesArray: { publicId: string, url: string }[] | undefined = undefined;
    if (!reviewContent.trim() || reviewRating < 1 || reviewRating > 5) return;
    try {
      setIsSubmittingReview(true);

      // 1. Upload media first (if attached). Backend tags it as 'temp'.
      if (reviewMediaFiles.length > 0) {
        setIsUploadingMedia(true);
        await dispatch(uploadMedia({
          files: reviewMediaFiles, ownerType: "REVIEW", callbackfn: (data) => {
            imagesArray = data.map((f: any) => ({
              url: f.url,
              publicId: f.public_id || f.publicId
            }));
          }
        })).unwrap();
        // const uploadedFiles = Array.isArray(uploadRes) ? uploadRes : uploadRes?.files;
        // if (uploadedFiles && uploadedFiles.length > 0) {
        //   imagesArray = uploadedFiles.map((f: any) => ({
        //     url: f.url,
        //     publicId: f.public_id || f.publicId
        //   }));
        // }
        setIsUploadingMedia(false);
      }

      // 2. Submit the review — backend links the temp-tagged asset once metadata is saved.
      const payload = {
        reviewType: "ITEM",
        itemId: id!,
        content: reviewContent,
        rating: reviewRating,
        images: imagesArray
      };
      await dispatch(submitProductReview(payload)).unwrap();

      toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
      setReviewContent("");
      setReviewRating(5);
      clearMediaFile();

      // 3. Refetch reviews list
      dispatch(fetchProductReviews({ id: id!, pagination: { page: 1, limit: 10, sortBy: 'createdAt', isAsc: false } as any }));
    } catch (err) {
      setIsUploadingMedia(false);
      toast({ title: "Error", description: "Failed to submit review. You must have purchased this item first.", variant: "destructive" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setDeletingReviewId(reviewId);
      await dispatch(deleteProductReview(reviewId)).unwrap();
      toast({ title: "Review Deleted", description: "Your review has been successfully removed." });
      dispatch(fetchProductReviews({ id: id!, pagination: { page: 1, limit: 10, sortBy: 'createdAt', isAsc: false } as any }));
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    } finally {
      setDeletingReviewId(null);
    }
  };

  const startEditingReview = (review: any) => {
    setEditingReviewId(review.id);
    setEditReviewContent(review.content);
    setEditReviewRating(review.rating);
    // review.images comes from API, so they have url and publicId unless they are just strings (some old data might be string array). Let's safely map.
    const mappedImages = (review.images || []).map((img: any) => {
      if (typeof img === 'string') return { url: img, publicId: img };
      return { url: img.imageUrl || img.url, publicId: img.publicId, id: img.id };
    }); // Ensure we have something to show

    setEditExistingImages(mappedImages);
    setEditImagesToDelete([]);
    setEditNewMediaFiles([]);
    setEditNewMediaPreviews([]);
    setIsEditModalOpen(true);
  };

  const handleEditMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalAllowed = 5 - editExistingImages.length;
    const newFiles = [...editNewMediaFiles, ...files].slice(0, totalAllowed);
    setEditNewMediaFiles(newFiles);

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      size: file.size,
    }));

    editNewMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setEditNewMediaPreviews(newPreviews);
  };

  const removeEditExistingMedia = (index: number) => {
    const imgToRemove = editExistingImages[index];
    if (imgToRemove && imgToRemove.publicId) {
      setEditImagesToDelete(prev => [...prev, imgToRemove.publicId]);
      setEditExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const clearAllEditMedia = () => {
    // Delete existing ones
    const publicIdsToDel = editExistingImages.map(img => img.publicId).filter(Boolean);
    if (publicIdsToDel.length > 0) {
      setEditImagesToDelete(prev => [...prev, ...publicIdsToDel]);
      setEditExistingImages([]);
    }

    // Clear new ones
    setEditNewMediaFiles([]);
    editNewMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setEditNewMediaPreviews([]);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const removeEditNewMedia = (index: number) => {
    const newFiles = editNewMediaFiles.filter((_, i) => i !== index);
    const newPreviews = editNewMediaPreviews.filter((_, i) => i !== index);
    setEditNewMediaFiles(newFiles);
    setEditNewMediaPreviews(newPreviews);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleSubmitEditReview = async () => {
    if (!editingReviewId || !editReviewContent.trim() || editReviewRating < 1 || editReviewRating > 5) return;

    try {
      setIsSubmittingEdit(true);

      let imagesToAddArray: { publicId: string, url: string }[] | undefined = undefined;

      // 1. Upload new media (if attached)
      if (editNewMediaFiles.length > 0) {
        setIsUploadingEditMedia(true);
        await dispatch(uploadMedia({
          files: editNewMediaFiles, ownerType: "REVIEW", callbackfn: (data) => {
            imagesToAddArray = data.map((f: any) => ({
              url: f.url,
              publicId: f.public_id || f.publicId
            }));
          }
        })).unwrap();
        setIsUploadingEditMedia(false);
      }
      console.log(editImagesToDelete, 'what am i getting')
      // 2. Submit the patch map
      const payload = {
        content: editReviewContent,
        rating: editReviewRating,
        imagesToDelete: editImagesToDelete ?? [],
        imagesToAdd: imagesToAddArray ?? []
      };

      await dispatch(updateProductReview({ id: editingReviewId, payload })).unwrap();

      toast({ title: "Review Updated", description: "Your review has been successfully updated!" });
      setIsEditModalOpen(false);

      // Cleanup Object URLs
      editNewMediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
      setEditNewMediaPreviews([]);
      setEditNewMediaFiles([]);


      // 3. Refetch reviews list
      dispatch(fetchProductReviews({ id: id!, pagination: { page: 1, limit: 10, sortBy: 'createdAt', isAsc: false } as any }));
    } catch (err) {
      debugger
      setIsUploadingEditMedia(false);
      toast({ title: "Error", description: "Failed to update review.", variant: "destructive" });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold">{error || "Product not found"}</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBack = () => {
    if (lastPath) {
      navigate(lastPath);
    } else {
      navigate("/");
    }
  };

  const handleAddToCart = () => {
    appDispatch(
      addToCart({
        itemId: product.id,
        isGuestCart: !user,
        userId: !user?.id ? guestUserId : user?.id,
      })
    );
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: isFavorite ? "Item removed from your wishlist" : "Item added to your wishlist",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 gap-2 hover:bg-transparent hover:text-primary pl-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {lastPath === "/" ? "Home" : "Products"}
            </Button>

            {/* Product Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg relative group">
                  <ModernImage
                    src={product.image}
                    alt={product.name}
                    className="group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-md" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Link copied", description: "Product link copied to clipboard" });
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="px-3 py-1 text-sm">{product.category?.name || "Category"}</Badge>
                    {product.createdAt && <Badge className="bg-green-500 hover:bg-green-600">New Arrival</Badge>}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                      <div className="flex">{renderStars(product.rating || 0)}</div>
                      <span className="text-sm font-medium ml-1">{product.rating || 0}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} verified reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-4 border-b pb-8">
                  <span className="text-5xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  {product.price && (
                    <div className="flex flex-col mb-1">
                      <span className="text-lg text-muted-foreground line-through decoration-2">
                        ${(product.price * 1.2).toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-500">
                        Save 20%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description || "Experience premium quality with this exceptional product. Designed for durability and style, it's the perfect addition to your collection."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex items-center border-2 rounded-xl bg-background">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-l-xl hover:bg-muted"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-r-xl hover:bg-muted"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    className="flex-1 h-12 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  <Button
                    variant="secondary"
                    className="flex-1 h-12 text-lg font-semibold rounded-xl"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl border-2"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <Truck className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-xs text-muted-foreground mt-1">On orders over $50</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <Shield className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">2 Year Warranty</p>
                    <p className="text-xs text-muted-foreground mt-1">Full coverage</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-xl">
                    <RotateCcw className="h-8 w-8 mb-3 text-primary" />
                    <p className="font-semibold">30 Days Return</p>
                    <p className="text-xs text-muted-foreground mt-1">No questions asked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Carousels Section */}
            <div className="mt-16 space-y-4">
              <ProductCarouselSection
                title="Similar Items"
                itemId={id!}
                items={state.similarItems.items}
                loading={state.similarItems.pagination.loading}
                fetchEndpointThunk={fetchSimilarItems}
              />
              <ProductCarouselSection
                title="Items You May Like"
                itemId={id!}
                items={state.alsoLikeItems.items}
                loading={state.alsoLikeItems.pagination.loading}
                fetchEndpointThunk={fetchAlsoLikeItems}
              />
              <ProductCarouselSection
                title="People Also Bought"
                itemId={id!}
                items={state.alsoBoughtItems.items}
                loading={state.alsoBoughtItems.pagination.loading}
                fetchEndpointThunk={fetchAlsoBoughtItems}
              />
            </div>

            {/* Reviews Section */}
            <div className="mt-16 border-t pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold">Customer Reviews</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Side: Reviews List (60%) */}
                <div className="w-full lg:w-[60%] order-2 lg:order-1 max-h-[800px] overflow-y-auto pr-2 hide-scrollbar">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {reviews.map((review: any, index: number) => (
                      <Card key={index} className="bg-muted/10 border shadow-sm hover:border-primary/20 transition-colors">
                        <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-xs">{review.user?.firstname?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-sm">{review.user?.firstname ? `${review.user.firstname} ${review.user.lastname || ''}` : "Anonymous"}</h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex mt-0.5">{renderStars(review.rating || 5)}</div>
                                  {review.createdAt && (
                                    <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {user && (review.userId === user.id || review.user?.id === user.id) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => startEditingReview(review)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive" 
                                    onClick={(e) => {
                                      if (deletingReviewId === review.id) {
                                        e.preventDefault();
                                        return;
                                      }
                                      handleDeleteReview(review.id);
                                    }}
                                  >
                                    {deletingReviewId === review.id ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed flex-1">{review.content}</p>

                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                              {review.images.map((img: any, i: number) => {
                                const url = img.imageUrl || img.url || img;
                                const isVid = (img.type && img.type.startsWith('video/')) || url.includes('/video/upload/') || url.match(/\.(mp4|webm|ogg|mov)$/i);
                                return (
                                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border bg-muted/30" onClick={() => openImageViewer(review, i)}>
                                    {isVid ? (
                                      <div className="flex flex-col items-center justify-center p-1 h-full w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors">
                                        <Film className="h-5 w-5 mb-0.5 text-primary" />
                                        <span className="text-[8px] font-medium uppercase">Video</span>
                                      </div>
                                    ) : (
                                      <ModernImage src={url} alt={`Review img ${i}`} containerClassName="w-full h-full" className="object-cover hover:scale-110 transition-transform duration-300" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {reviews.length === 0 && (
                      <div className="col-span-full py-10 px-6 flex flex-col items-center justify-center text-center bg-muted/10 rounded-xl border border-dashed">
                        <div className="bg-background p-3 rounded-full shadow-sm mb-3">
                          <Star className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-base font-semibold mb-1">No reviews yet</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">There are no reviews for this product yet. Be the first one to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Write a Review / Message (40%) */}
                <div className="w-full lg:w-[40%] order-1 lg:order-2 lg:sticky lg:top-24">
                  {user ? (
                    userHasReviewed ? (
                      <Card className="border-primary/20 shadow-sm bg-primary/5">
                        <CardContent className="p-6 text-center flex flex-col items-center">
                          <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Review Submitted</h3>
                          <p className="text-sm text-muted-foreground max-w-[250px]">
                            You have already shared your thoughts on this product. You can manage it from the list.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-primary/20 shadow-sm bg-primary/5">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
                          <div className="space-y-4">
                            <div>
                              <span className="text-sm font-medium mb-1.5 block">Rating</span>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-6 w-6 cursor-pointer transition-colors hover:scale-110 ${i < reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => setReviewRating(i + 1)}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium mb-1.5 block">Your Review</span>
                              <Textarea
                                placeholder="What did you like or dislike? What did you use this product for?"
                                className="resize-none h-20 text-sm"
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                              />
                            </div>

                            <div>
                              <span className="text-sm font-medium mb-2 block">Attach Proof (optional)</span>
                              <input
                                ref={fileInputRef}
                                id="review-media-input"
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleMediaFileChange}
                              />

                              {reviewMediaFiles.length === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all text-sm font-medium w-full justify-center"
                                >
                                  <Paperclip className="h-4 w-4" />
                                  Attach images or videos (up to 5)
                                </button>
                              ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {reviewMediaPreviews.map((preview, idx) => (
                                    <div key={idx} className="relative rounded-xl overflow-hidden border border-border bg-muted/30 group h-20">
                                      {preview.type.startsWith("video/") ? (
                                        <div className="flex flex-col items-center justify-center p-2 h-full">
                                          <Film className="h-6 w-6 text-primary mb-1" />
                                          <p className="text-[10px] text-center font-medium line-clamp-1 w-full">{preview.name}</p>
                                        </div>
                                      ) : (
                                        <div className="relative h-full w-full">
                                          <img
                                            src={preview.url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                                            <p className="text-white text-[10px] font-medium truncate">{preview.name}</p>
                                          </div>
                                        </div>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeMediaFile(idx)}
                                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/90 shadow border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                  {reviewMediaFiles.length < 5 && (
                                    <button
                                      type="button"
                                      onClick={() => fileInputRef.current?.click()}
                                      className="flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all text-sm font-medium w-full"
                                    >
                                      <Paperclip className="h-4 w-4 mb-1" />
                                      <span className="text-[10px]">Add More</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={handleSubmitReview}
                              disabled={isSubmittingReview || isUploadingMedia || !reviewContent.trim()}
                              className="w-full sm:w-auto mt-2"
                            >
                              {(isUploadingMedia || isSubmittingReview) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              {isUploadingMedia ? "Uploading media..." : isSubmittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ) : (
                    <Card className="border-primary/20 shadow-sm bg-primary/5">
                      <CardContent className="p-6 text-center flex flex-col items-center">
                        <div className="bg-primary/10 p-3 rounded-full mb-4">
                          <Edit className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-[250px]">
                          Please log in to share your thoughts on this product with others.
                        </p>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
                          Log In to Review
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ImageViewer
        images={viewerImages}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        initialIndex={viewerInitialIndex}
        authorName={viewerAuthor}
        reviewContent={viewerContent}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <span className="text-sm font-medium mb-2 block">Rating</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 cursor-pointer transition-colors hover:scale-110 ${i < editReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setEditReviewRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium mb-2 block">Your Review</span>
              <Textarea
                placeholder="What did you like or dislike? What did you use this product for?"
                className="resize-none h-24"
                value={editReviewContent}
                onChange={(e) => setEditReviewContent(e.target.value)}
              />
            </div>

            {/* Media Attachment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Manage Media</span>
                {(editExistingImages.length > 0 || editNewMediaFiles.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearAllEditMedia} className="text-sm h-8 text-destructive hover:text-destructive">
                    Clear All
                  </Button>
                )}
              </div>
              <input
                ref={editFileInputRef}
                id="edit-review-media-input"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleEditMediaFileChange}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {/* Existing Images */}
                {editExistingImages.map((img, idx) => (
                  <div key={`exist-${idx}`} className="relative rounded-xl overflow-hidden border border-border bg-muted/30 group h-24">
                    <div className="relative h-full w-full">
                      <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEditExistingMedia(idx)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/90 shadow border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* New Previews */}
                {editNewMediaPreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative rounded-xl overflow-hidden border border-border bg-muted/30 group h-24">
                    {preview.type.startsWith("video/") ? (
                      <div className="flex flex-col items-center justify-center p-3 h-full">
                        <Film className="h-8 w-8 text-primary mb-1" />
                        <p className="text-[10px] text-center font-medium line-clamp-1 w-full">{preview.name}</p>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeEditNewMedia(idx)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/90 shadow border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Add More Button */}
                {(editExistingImages.length + editNewMediaFiles.length) < 5 && (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all text-sm font-medium w-full"
                  >
                    <Paperclip className="h-5 w-5 mb-1" />
                    <span className="text-[10px]">Add More</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitEditReview} disabled={isSubmittingEdit || isUploadingEditMedia || !editReviewContent.trim()}>
                {(isSubmittingEdit || isUploadingEditMedia) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploadingEditMedia ? "Uploading..." : isSubmittingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};