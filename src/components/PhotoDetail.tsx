
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoDetailProps {
  photo: Photo;
  onClose: () => void;
  nextPhotoId?: string;
  prevPhotoId?: string;
}

const PhotoDetail = ({ photo, onClose, nextPhotoId, prevPhotoId }: PhotoDetailProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'ArrowRight' && nextPhotoId) {
      navigate(`/photo/${nextPhotoId}`, { replace: true });
    } else if (e.key === 'ArrowLeft' && prevPhotoId) {
      navigate(`/photo/${prevPhotoId}`, { replace: true });
    }
  };

  const openGoogleMaps = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  };

  useEffect(() => {
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [nextPhotoId, prevPhotoId]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center transition-opacity duration-300",
        isClosing ? "opacity-0" : "opacity-100",
        !isLoaded && "bg-black/95"
      )}
      onClick={handleClose}
    >
      {/* Close button */}
      <button 
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/20 rounded-full p-2 transition-colors"
        onClick={handleClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>
      
      {/* Navigation buttons */}
      {prevPhotoId && (
        <button 
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-2 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/photo/${prevPhotoId}`, { replace: true });
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      {nextPhotoId && (
        <button 
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-2 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/photo/${nextPhotoId}`, { replace: true });
          }}
          aria-label="Next photo"
        >
          <ChevronRight size={24} />
        </button>
      )}
      
      {/* Photo container */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className={cn(
            "max-w-full max-h-[80vh] object-contain transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Photo info */}
        <div className="mt-4 text-white">
          <h2 className="text-xl font-medium mb-2">{photo.title}</h2>
          
          {photo.description && (
            <p className="text-white/80 text-sm mb-3">{photo.description}</p>
          )}
          
          {photo.location && (
            <button 
              className="inline-flex items-center text-sm text-white/70 hover:text-white/100 transition-colors"
              onClick={() => openGoogleMaps(photo.location!.latitude, photo.location!.longitude)}
            >
              <MapPin size={16} className="mr-1" />
              {photo.location.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
