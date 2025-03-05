
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Photo } from "@/types";
import { getAllPhotos } from "@/lib/photoService";
import LocationMap from "@/components/LocationMap";
import { cn } from "@/lib/utils";

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  const uniqueTags = [...new Set(photos.flatMap(photo => photo.tags || []))];

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const allPhotos = await getAllPhotos();
        setPhotos(allPhotos);
      } catch (error) {
        console.error("Failed to load photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const filteredPhotos = selectedTag 
    ? photos.filter(photo => photo.tags?.includes(selectedTag)) 
    : photos;

  const handlePhotoClick = (id: string) => {
    navigate(`/photo/${id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-background">
      <div className="container mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Galerie de photos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explorez ma collection de photographies capturées à travers le monde. Cliquez sur une image pour l'afficher en plein écran.
          </p>
          
          {/* Tags filter */}
          {uniqueTags.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "px-3 py-1 text-sm rounded-full transition-colors",
                  !selectedTag 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                Tous
              </button>
              
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors",
                    selectedTag === tag 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted/30 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="photo-grid">
            {filteredPhotos.map(photo => (
              <div 
                key={photo.id}
                className="group bg-card rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                {/* Photo */}
                <div 
                  className="aspect-[4/3] overflow-hidden cursor-pointer" 
                  onClick={() => handlePhotoClick(photo.id)}
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium">{photo.title}</h3>
                  
                  {photo.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                  )}
                  
                  {/* Tags */}
                  {photo.tags && photo.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {photo.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-secondary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Location Map */}
                  {photo.location && (
                    <div className="mt-3">
                      <LocationMap location={photo.location} size="small" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune photo disponible dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
