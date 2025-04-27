import axiosClient from "@/lib/axois-client";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import React, { useState, useEffect } from "react";
import Shimmer from "../shimmer/Shimmer";

// Image data interface
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  shimmerClassName?: string;
  ShimmerIconClassName?: string;
  src: string | undefined;
  routeIdentifier: "public" | "profile";
  media?: string;
}

// Custom image cache singleton
class ImageCache {
  private static instance: ImageCache;
  private cache: Record<string, string>;

  private constructor() {
    this.cache = {};
  }

  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  public getImage(src: string): string | null {
    return this.cache[src] || null;
  }

  public cacheImage(src: string, img: string): void {
    this.cache[src] = img;
  }
}

// Image component with caching
const CachedImage = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      className,
      shimmerClassName,
      ShimmerIconClassName,
      children,
      routeIdentifier,
      media = "media/",
      ...props
    },
    ref
  ) => {
    const [image, setImage] = useState<string | null>(null);
    const [failed, setFailed] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const download = async () => {
      try {
        if (src == null || src == undefined) {
          if (image) setImage(null);
          setLoading(false);
          return;
        }
        if (typeof src == "object") {
          setImage(URL.createObjectURL(src));
          setLoading(false);
          return;
        }
        const cache = ImageCache.getInstance();

        // Check if image is already cached
        const cachedImage = cache.getImage(src);
        if (cachedImage) {
          setImage(cachedImage);
        } else {
          // Image not cached, fetch and cache
          const response = await axiosClient.get(`${media}${routeIdentifier}`, {
            params: {
              path: src,
            },
            responseType: "blob", // Important
          });
          if (response.status == 200) {
            // Create a temporary URL for the downloaded image
            const imageUrl = URL.createObjectURL(new Blob([response.data]));
            if (response.data.type == "application/json") {
              setFailed(true);
              return;
            }
            setImage(imageUrl);
            cache.cacheImage(src, imageUrl);
          }
        }
      } catch (error: any) {
        console.log(error);
        setFailed(true);
      }
      setLoading(false);
    };
    useEffect(() => {
      download();
    }, [src]);

    if (loading) {
      return (
        <Shimmer
          className={cn(
            "size-9 bg-primary/15 w-full rounded-sm flex justify-center items-center",
            shimmerClassName
          )}
        >
          <svg
            onClick={download}
            className={cn("size-9 fill-primary/30", ShimmerIconClassName)}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </Shimmer>
      );
    } else if (failed || !image) {
      return (
        <div
          className={cn(
            "size-9 w-full rounded-sm flex justify-center items-center",
            shimmerClassName
          )}
        >
          <UserRound
            className={cn("size-9 text-primary/80", ShimmerIconClassName)}
          />
        </div>
      );
    }
    return (
      <img
        ref={ref}
        className={cn("", className)}
        {...props}
        src={image}
        alt={alt}
      />
    );
  }
);

export default CachedImage;
