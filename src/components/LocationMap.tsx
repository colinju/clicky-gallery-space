
import { MapPin } from 'lucide-react';
import { Location } from '@/types';

interface LocationMapProps {
  location: Location;
  size?: 'small' | 'medium' | 'large';
}

const LocationMap = ({ location, size = 'medium' }: LocationMapProps) => {
  const sizeClasses = {
    small: 'h-20',
    medium: 'h-40',
    large: 'h-60'
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank');
  };

  // Create a static map URL (Google Maps Static API or OpenStreetMap can be used)
  // This is a simple implementation that would work with a Google Maps API key
  // For production, you'd need to add your API key
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${location.latitude},${location.longitude}&key=YOUR_API_KEY`;
  
  // Placeholder background that looks like a map
  const mapBackground = `bg-slate-200 bg-opacity-70 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]`;

  return (
    <div 
      className={`relative w-full ${sizeClasses[size]} rounded-md overflow-hidden cursor-pointer ${mapBackground}`}
      onClick={openGoogleMaps}
    >
      {/* This would be your actual map if you had an API key */}
      {/* <img 
        src={mapUrl} 
        alt={`Map location of ${location.name}`}
        className="w-full h-full object-cover"
      /> */}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <span className="absolute -top-6 -left-6 w-12 h-12 bg-primary/20 rounded-full animate-ping opacity-75"></span>
          <MapPin size={32} className="text-primary" />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 text-center">
        <p className="text-sm font-medium">{location.name}</p>
        <p className="text-xs text-muted-foreground">Cliquez pour voir sur Google Maps</p>
      </div>
    </div>
  );
};

export default LocationMap;
