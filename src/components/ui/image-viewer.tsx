import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface ImageViewerMedia {
  url: string;
  type?: string;
}

interface ImageViewerProps {
  images: ImageViewerMedia[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  reviewContent?: string;
}

export function ImageViewer({ images, initialIndex = 0, isOpen, onClose, authorName, reviewContent }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!images || images.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const currentMedia = images[currentIndex];
  
  const isVideo = (url: string, type?: string) => {
    if (type && type.startsWith("video/")) return true;
    if (url.includes("/video/upload/")) return true;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none shadow-2xl flex flex-col overflow-hidden sm:rounded-xl [&>button]:hidden">
        <DialogTitle className="sr-only">Media Viewer</DialogTitle>
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Media Area */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center bg-black/50 overflow-hidden">
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute top-4 left-4 z-50 bg-black/50 text-white/80 px-3 py-1 rounded-full text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          <div className="w-full h-full flex items-center justify-center p-4">
            {isVideo(currentMedia.url, currentMedia.type) ? (
              <video
                src={currentMedia.url}
                controls
                className="max-w-full max-h-full object-contain select-none shadow-lg"
                autoPlay
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={`Media ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none transition-transform duration-300 shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Content Area (Author + Text + Thumbnails) */}
        <div className="bg-zinc-950 p-4 sm:p-6 flex flex-col gap-4 border-t border-white/10 shrink-0">
          {(authorName || reviewContent) && (
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto hide-scrollbar">
              {authorName && (
                <div className="flex items-center gap-2 text-white">
                  <Avatar className="h-6 w-6 border border-white/20">
                    <AvatarFallback className="bg-zinc-800 text-xs">
                      {authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{authorName}</span>
                </div>
              )}
              {reviewContent && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {reviewContent}
                </p>
              )}
            </div>
          )}

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar w-full mt-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  {isVideo(img.url, img.type) ? (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-white text-[10px] uppercase font-bold">Video</span>
                    </div>
                  ) : (
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
