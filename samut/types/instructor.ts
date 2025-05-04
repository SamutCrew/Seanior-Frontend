export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface InstructorDescription {
  id: string
  name: string
  profileImage: string
  specialty: string;
  styles: string[];
  levels: string[];
  certification: string[];
  rating: number;
  experience: number;
  lessonType: string;
  price: number;
  location: Location;
  bio: string
  teachingPhilosophy: string
  image: string;
  email: string
  phone: string
  contactHours: string
  specializations: Specialization[]
  certifications: Certification[]
  testimonials: Testimonial[]
  availability: Availability
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  profile_img: string;
  description: InstructorDescription;
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

export interface InstructorFilters {
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

  export interface Specialization {
    title: string
    description: string
  }
  
  export interface Certification {
    id: string
    name: string
    issuer: string
    issueDate: string
    expiryDate?: string
    description: string
    logo?: string
    skills?: string[]
    verificationUrl?: string
  }
  

export interface Testimonial {
    id: string
    name: string
    avatar?: string
    rating: number
    text: string
    course: string
    date: string
  }
  
  export interface Availability {
    [day: string]: AvailabilitySlot[]
  }
  
  export interface AvailabilitySlot {
    startTime: string
    endTime: string
    location?: string
  }
  
  export interface InstructorCardProps {
    instructor: Instructor
    userLocation?: Location | null
    isDarkMode?: boolean
  }