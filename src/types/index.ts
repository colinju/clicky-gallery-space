
export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  location?: Location;
  tags?: string[];
  featured?: boolean;
  createdAt: Date;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}
