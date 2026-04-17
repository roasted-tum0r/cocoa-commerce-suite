import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Slider } from "./slider";
import { getCroppedImg } from "@/utility/canvasUtils";
import { Loader2 } from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteEvent = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full sm:rounded-xl p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] bg-black/5">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteEvent}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>
        </div>

        <DialogFooter className="p-4 border-t gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
