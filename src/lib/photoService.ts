
import { Photo, Location } from "@/types";

// Mock data - this would be replaced with actual API calls
const mockPhotos: Photo[] = [
  {
    id: "1",
    title: "Sunset at the Beach",
    description: "Beautiful sunset captured at the Mediterranean sea.",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "Saint-Tropez, France",
      latitude: 43.2727,
      longitude: 6.6406
    },
    tags: ["landscape", "sunset", "nature"],
    featured: true,
    createdAt: new Date("2023-06-15")
  },
  {
    id: "2",
    title: "Mountain Peaks",
    description: "Majestic mountain range in the early morning light.",
    imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1748&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "Alps, Switzerland",
      latitude: 46.8182,
      longitude: 8.2275
    },
    tags: ["mountains", "landscape", "nature"],
    featured: true,
    createdAt: new Date("2023-07-22")
  },
  {
    id: "3",
    title: "City Skyline",
    description: "Metropolitan skyline at night with all the city lights.",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1756&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "New York, USA",
      latitude: 40.7128,
      longitude: -74.0060
    },
    tags: ["urban", "city", "night"],
    featured: true,
    createdAt: new Date("2023-08-03")
  },
  {
    id: "4",
    title: "Autumn Forest",
    description: "Vibrant autumn colors in a dense forest.",
    imageUrl: "https://images.unsplash.com/photo-1487111023822-2e903e12f6f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1487111023822-2e903e12f6f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "Vermont, USA",
      latitude: 44.5588,
      longitude: -72.5778
    },
    tags: ["autumn", "forest", "nature"],
    featured: false,
    createdAt: new Date("2023-10-09")
  },
  {
    id: "5",
    title: "Desert Landscape",
    description: "Endless sand dunes in the Sahara Desert.",
    imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1752&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "Sahara Desert, Morocco",
      latitude: 31.7917,
      longitude: -7.0926
    },
    tags: ["desert", "landscape", "nature"],
    featured: false,
    createdAt: new Date("2023-05-17")
  },
  {
    id: "6",
    title: "Historic Architecture",
    description: "Ancient ruins showcasing magnificent architecture.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1756&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1548013146-72479768bca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    location: {
      name: "Rome, Italy",
      latitude: 41.9028,
      longitude: 12.4964
    },
    tags: ["architecture", "history", "travel"],
    featured: true,
    createdAt: new Date("2023-09-14")
  }
];

// Service functions
export const getAllPhotos = (): Promise<Photo[]> => {
  return Promise.resolve([...mockPhotos]);
};

export const getFeaturedPhotos = (): Promise<Photo[]> => {
  return Promise.resolve(mockPhotos.filter(photo => photo.featured));
};

export const getPhotoById = (id: string): Promise<Photo | undefined> => {
  return Promise.resolve(mockPhotos.find(photo => photo.id === id));
};

export const addPhoto = (photo: Omit<Photo, 'id' | 'createdAt'>): Promise<Photo> => {
  const newPhoto: Photo = {
    ...photo,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  mockPhotos.push(newPhoto);
  return Promise.resolve(newPhoto);
};

export const updatePhoto = (id: string, updates: Partial<Photo>): Promise<Photo | undefined> => {
  const index = mockPhotos.findIndex(photo => photo.id === id);
  if (index === -1) return Promise.resolve(undefined);
  
  mockPhotos[index] = { ...mockPhotos[index], ...updates };
  return Promise.resolve(mockPhotos[index]);
};

export const deletePhoto = (id: string): Promise<boolean> => {
  const index = mockPhotos.findIndex(photo => photo.id === id);
  if (index === -1) return Promise.resolve(false);
  
  mockPhotos.splice(index, 1);
  return Promise.resolve(true);
};
