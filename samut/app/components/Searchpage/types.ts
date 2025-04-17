export interface Location {
    lat: number;
    lng: number;
    address?: string;
  }
  
  export interface Teacher {
    id: number;
    name: string;
    specialty: string;
    styles: string[];
    levels: string[];
    certification: string[];
    rating: number;
    experience: number;
    image: string;
    bio: string;
    lessonType: string;
    price: number;
    location: Location;
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