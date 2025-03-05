
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import PhotoCarousel from "@/components/PhotoCarousel";
import { Photo } from "@/types";
import { getFeaturedPhotos } from "@/lib/photoService";

const Index = () => {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photos = await getFeaturedPhotos();
        setFeaturedPhotos(photos);
      } catch (error) {
        console.error("Failed to load featured photos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Featured Work Section */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Portfolio</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Œuvres en vedette</h3>
            </div>
            <Link 
              to="/gallery" 
              className="group mt-4 md:mt-0 inline-flex items-center text-sm font-medium hover:text-primary/80 transition-colors"
            >
              Voir toute la galerie 
              <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="h-[500px] bg-muted/30 animate-pulse rounded-lg flex items-center justify-center">
              Chargement des photos...
            </div>
          ) : featuredPhotos.length > 0 ? (
            <PhotoCarousel photos={featuredPhotos} />
          ) : (
            <div className="h-[300px] bg-muted/30 rounded-lg flex items-center justify-center">
              Aucune photo en vedette disponible.
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">À propos</h2>
          <p className="text-lg mb-8 text-muted-foreground">
            Passionné par la beauté du monde qui nous entoure, je m'efforce de capturer l'essence de chaque moment
            à travers mon objectif. Cette galerie est une collection de mes expériences et voyages,
            chaque image racontant sa propre histoire.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-3">Vision</h3>
              <p className="text-muted-foreground">Capturer l'authenticité des moments et des lieux avec une perspective unique.</p>
            </div>
            
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-3">Mission</h3>
              <p className="text-muted-foreground">Partager la beauté du monde à travers des images qui inspirent et émeuvent.</p>
            </div>
            
            <div className="p-6 bg-background rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-3">Approche</h3>
              <p className="text-muted-foreground">Créer des compositions visuelles avec attention aux détails et à la lumière naturelle.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
