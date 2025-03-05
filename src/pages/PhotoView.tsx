
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Photo } from "@/types";
import { getPhotoById, getAllPhotos } from "@/lib/photoService";
import PhotoDetail from "@/components/PhotoDetail";
import LocationMap from "@/components/LocationMap";

const PhotoView = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [nextPhotoId, setNextPhotoId] = useState<string | undefined>(undefined);
  const [prevPhotoId, setPrevPhotoId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPhoto = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const photoData = await getPhotoById(id);
        if (!photoData) {
          navigate('/gallery');
          return;
        }
        
        setPhoto(photoData);
        
        // Get all photos to determine next/prev
        const allPhotos = await getAllPhotos();
        const currentIndex = allPhotos.findIndex(p => p.id === id);
        
        if (currentIndex > 0) {
          setPrevPhotoId(allPhotos[currentIndex - 1].id);
        } else {
          setPrevPhotoId(undefined);
        }
        
        if (currentIndex < allPhotos.length - 1) {
          setNextPhotoId(allPhotos[currentIndex + 1].id);
        } else {
          setNextPhotoId(undefined);
        }
      } catch (error) {
        console.error("Failed to load photo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [id, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!photo) return null;

  return (
    <>
      <PhotoDetail 
        photo={photo} 
        onClose={handleClose} 
        nextPhotoId={nextPhotoId} 
        prevPhotoId={prevPhotoId} 
      />
      
      {/* This content is only for SEO and non-JS fallback, normally not visible */}
      <div className="sr-only">
        <h1>{photo.title}</h1>
        {photo.description && <p>{photo.description}</p>}
        {photo.location && <p>Location: {photo.location.name}</p>}
        <button onClick={handleClose}>Close</button>
      </div>
    </>
  );
};

export default PhotoView;
