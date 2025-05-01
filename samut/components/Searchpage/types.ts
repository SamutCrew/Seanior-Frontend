export interface Location {
    lat: number;
    lng: number;
    address?: string;
  }
  
  export interface TeacherDescription {
    specialty: string;
    styles: string[];
    levels: string[];
    certification: string[];
    rating: number;
    experience: number;
    lessonType: string;
    price: number;
    location: Location;
    bio: string;
    image: string;
  }
  
  export interface Teacher {
    id: number;
    name: string;
    email: string;
    profile_img: string;
    description: TeacherDescription;
  }
  
  export interface Course {
    id: number;
    title: string;
    focus: string;
    level: string;
    duration: string;
    schedule: string;
    instructor: string;
    rating: number;
    students: number;
    price: number;
    location: Location;
  }
  
  export interface TeacherFilters {
    style: string;
    level: string;
    lessonType: string;
    certification: string;
    minRating: number;
    priceRange: string;
    maxDistance: number;
  }
  
  export interface CourseFilters {
    focus: string;
    level: string;
    duration: string;
    schedule: string;
    minRating: number;
    priceRange: string;
    maxDistance: number;
  }
  export interface OSMMapSelectorProps {
    center: { lat: number; lng: number };
    onLocationSelect: (location: { lat: number; lng: number }) => void;
  }