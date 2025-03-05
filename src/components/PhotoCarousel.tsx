
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoCarouselProps {
  photos: Photo[];
  autoPlay?: boolean;
  interval?: number;
}

const PhotoCarousel = ({ photos, autoPlay = true, interval = 5000 }: PhotoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % photos.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePhotoClick = (id: string) => {
    navigate(`/photo/${id}`);
  };

  useEffect(() => {
    if (autoPlay && !isPaused) {
      timerRef.current = setInterval(nextSlide, interval);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, autoPlay, interval, isPaused]);

  if (!photos.length) return null;

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[500px] md:h-[600px]">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 cursor-pointer",
              index === activeIndex && !isTransitioning ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            onClick={() => handlePhotoClick(photo.id)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            
            {/* Photo info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl md:text-2xl font-medium mb-2">{photo.title}</h3>
              {photo.description && (
                <p className="text-sm md:text-base opacity-80 line-clamp-2">{photo.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white p-2 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="Previous photo"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white p-2 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="Next photo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
