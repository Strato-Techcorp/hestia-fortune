"use client";

import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Optional callback fired when a card is clicked, e.g. to open a lightbox. */
  onItemClick?: (index: number, item: GalleryItem) => void;
  /** Show prev/next arrow controls on either side. Defaults to true. */
  showArrows?: boolean;
  /** Card width in px. Pass a smaller value on phones to shrink the cards. */
  cardWidth?: number;
  /** Card height in px. Pass a smaller value on phones to shrink the cards. */
  cardHeight?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 600,
      autoRotateSpeed = 0.02,
      onItemClick,
      showArrows = true,
      cardWidth = 300,
      cardHeight = 400,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const anglePerItem = 360 / items.length;

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    // Pause auto-rotation for a bit after a manual arrow click, same debounce
    // mechanism used for scroll, so the two don't fight each other.
    const pauseAutoRotate = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1600);
    };

    const goToPrevious = () => {
      setRotation(prev => prev + anglePerItem);
      pauseAutoRotate();
    };

    const goToNext = () => {
      setRotation(prev => prev - anglePerItem);
      pauseAutoRotate();
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn("relative w-full h-full flex items-center justify-center", className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.photo.url} 
                role="group"
                aria-label={item.common}
                className={cn("absolute", onItemClick && "cursor-pointer")}
                onClick={onItemClick ? () => onItemClick(i, item) : undefined}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `${-cardWidth / 2}px`,
                  marginTop: `${-cardHeight / 2}px`,
                  opacity: opacity,
                  transition: 'opacity 0.3s linear, width 0.2s ease, height 0.2s ease, margin 0.2s ease'
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || 'center' }}
                  />
                  {/* Overall darkening layer so text stays legible against any photo,
                      plus a stronger gradient toward the bottom where the caption sits. */}
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-4 bg-gradient-to-t from-black/85 to-transparent text-white">
                    <h2 className="text-sm sm:text-lg lg:text-xl font-bold leading-tight text-accent-hover">{item.common}</h2>
                    <em className="text-[11px] sm:text-sm italic opacity-80 leading-snug block">{item.binomial}</em>
                    {item.photo.by && (
                      <p className="text-[10px] sm:text-xs mt-2 opacity-70">Photo by: {item.photo.by}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev/next arrows -- sit outside the preserve-3d rotating wrapper
            so they stay flat and stationary regardless of rotation. */}
        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous item"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:text-white hover:bg-black/60 hover:border-white/30"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next item"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:text-white hover:bg-black/60 hover:border-white/30"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };