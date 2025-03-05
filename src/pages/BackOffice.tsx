
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, MapPin, X, PlusCircle, Save, Trash } from "lucide-react";
import { Photo, Location } from "@/types";
import { addPhoto, updatePhoto, deletePhoto, getAllPhotos } from "@/lib/photoService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PhotoFormData = {
  id?: string;
  title: string;
  description: string;
  imageFile?: File | null;
  imageUrl: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  tags: string[];
  featured: boolean;
};

const BackOffice = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    description: "",
    imageFile: null,
    imageUrl: "",
    location: null,
    tags: [],
    featured: false
  });
  const [currentTag, setCurrentTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const allPhotos = await getAllPhotos();
      setPhotos(allPhotos);
    } catch (error) {
      console.error("Failed to load photos:", error);
      toast.error("Erreur lors du chargement des photos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === "name" ? value : parseFloat(value) || 0
        } as Location
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.type === "checkbox" 
          ? (e.target as HTMLInputElement).checked 
          : value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: imageUrl
      }));
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTag.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, currentTag.trim().toLowerCase()]
    }));
    
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    if (formData.imageUrl && !formData.id) {
      URL.revokeObjectURL(formData.imageUrl);
    }
    
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      imageUrl: "",
      location: null,
      tags: [],
      featured: false
    });
    
    setIsEditing(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    
    if (!formData.imageUrl && !formData.imageFile) {
      toast.error("Une image est requise");
      return;
    }
    
    try {
      // In a real application, you would upload the file to a server here
      // and get back the URL. For now, we'll just use the existing URL.
      
      // For this demo, we'll assume the image URL is already set correctly
      const photoData: Omit<Photo, 'id' | 'createdAt'> = {
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        thumbnailUrl: formData.imageUrl, // In a real app, generate a thumbnail
        location: formData.location || undefined,
        tags: formData.tags.length ? formData.tags : undefined,
        featured: formData.featured
      };
      
      let updatedPhoto: Photo | undefined;
      
      if (formData.id) {
        // Update existing photo
        updatedPhoto = await updatePhoto(formData.id, photoData);
        if (updatedPhoto) {
          toast.success("Photo mise à jour avec succès");
          setPhotos(photos.map(photo => 
            photo.id === updatedPhoto?.id ? updatedPhoto : photo
          ));
        }
      } else {
        // Add new photo
        updatedPhoto = await addPhoto(photoData);
        toast.success("Photo ajoutée avec succès");
        setPhotos([updatedPhoto, ...photos]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Failed to save photo:", error);
      toast.error("Erreur lors de l'enregistrement de la photo");
    }
  };

  const handleEditPhoto = (photo: Photo) => {
    setFormData({
      id: photo.id,
      title: photo.title,
      description: photo.description || "",
      imageUrl: photo.imageUrl,
      imageFile: null,
      location: photo.location || null,
      tags: photo.tags || [],
      featured: photo.featured || false
    });
    
    setIsEditing(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      return;
    }
    
    try {
      const success = await deletePhoto(id);
      if (success) {
        toast.success("Photo supprimée avec succès");
        setPhotos(photos.filter(photo => photo.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Erreur lors de la suppression de la photo");
    }
  };

  const handleViewPhoto = (id: string) => {
    navigate(`/photo/${id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-background">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Espace Administration</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gérez vos photos, ajoutez des descriptions et des informations de localisation.
          </p>
        </header>

        {/* Photo Form */}
        <div className="mb-16 p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-6">
            {isEditing ? "Modifier la photo" : "Ajouter une nouvelle photo"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="flex items-start space-x-4">
                {formData.imageUrl ? (
                  <div className="relative w-40 h-40 bg-secondary rounded-md overflow-hidden">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.id) {
                          URL.revokeObjectURL(formData.imageUrl);
                        }
                        setFormData(prev => ({
                          ...prev,
                          imageFile: null,
                          imageUrl: ""
                        }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="w-40 h-40 border-2 border-dashed border-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload image</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors"
                  >
                    Choisir un fichier
                  </button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG, WebP. Taille max: 5 MB.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Titre *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Localisation</label>
                {formData.location && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, location: null }))}
                    className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Supprimer la localisation
                  </button>
                )}
              </div>
              
              {formData.location ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="location.name" className="block text-sm mb-1">Nom du lieu</label>
                    <input
                      type="text"
                      id="location.name"
                      name="location.name"
                      value={formData.location.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location.latitude" className="block text-sm mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        id="location.latitude"
                        name="location.latitude"
                        value={formData.location.latitude}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="location.longitude" className="block text-sm mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        id="location.longitude"
                        name="location.longitude"
                        value={formData.location.longitude}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    location: { name: "", latitude: 0, longitude: 0 } 
                  }))}
                  className="flex items-center px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors"
                >
                  <MapPin size={16} className="mr-2" />
                  Ajouter une localisation
                </button>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-1 bg-secondary text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  placeholder="Ajouter un tag"
                  className="flex-1 px-3 py-2 border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-r-md transition-colors"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
            
            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4 border border-input rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <label htmlFor="featured" className="ml-2 text-sm">
                Mettre en avant sur la page d'accueil
              </label>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-input hover:bg-secondary rounded-md text-sm transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm transition-colors"
              >
                <Save size={16} className="mr-2" />
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>

        {/* Photos List */}
        <div>
          <h2 className="text-xl font-medium mb-6">Vos photos</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted/30 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : photos.length > 0 ? (
            <div className="space-y-4">
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  className="flex flex-col sm:flex-row bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div 
                    className="sm:w-48 h-32 sm:h-auto bg-secondary flex-shrink-0 cursor-pointer"
                    onClick={() => handleViewPhoto(photo.id)}
                  >
                    <img 
                      src={photo.thumbnailUrl || photo.imageUrl} 
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium mb-1">{photo.title}</h3>
                        {photo.featured && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            En vedette
                          </span>
                        )}
                      </div>
                      
                      {photo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {photo.description}
                        </p>
                      )}
                      
                      {photo.location && (
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <MapPin size={12} className="mr-1" />
                          {photo.location.name}
                        </div>
                      )}
                      
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {photo.tags.map(tag => (
                            <span 
                              key={tag}
                              className="px-1.5 py-0.5 text-xs bg-secondary rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleViewPhoto(photo.id)}
                        className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded transition-colors"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleEditPhoto(photo)}
                        className="px-3 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="px-3 py-1 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/10 rounded-lg">
              <p className="text-muted-foreground mb-4">Aucune photo n'a été ajoutée.</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm transition-colors"
              >
                Ajouter une photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackOffice;
