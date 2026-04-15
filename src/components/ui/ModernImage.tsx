import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackIcon?: React.ReactNode;
    containerClassName?: string;
}

export const ModernImage: React.FC<ModernImageProps> = ({
    src,
    alt,
    className,
    containerClassName,
    fallbackIcon,
    onError,
    ...props
}) => {
    const [hasError, setHasError] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setHasError(true);
        if (onError) onError(e);
    };
    console.log(src,'src')
    return (
        <div className={cn("relative overflow-hidden flex items-center justify-center", containerClassName)}>
            {hasError ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-muted text-muted-foreground p-4 text-center">
                    {fallbackIcon || <ImageOff className="h-1/3 w-1/3 opacity-20" />}
                    <span className="text-[10px] mt-2 font-medium opacity-50 capitalize tracking-tighter">Coming soon...</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onError={handleImageError}
                    className={cn("w-full h-full object-cover transition-transform duration-500", className)}
                    {...props}
                />
            )}
        </div>
    );
};
