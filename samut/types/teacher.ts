export interface Teacher {
    id: string
    name: string
    profileImage: string
    specialty: string
    bio: string
    teachingPhilosophy: string
    styles: string[]
    levels: string[]
    certification: string[]
    rating: number
    experience: number
    lessonType: string
    price: number
    email: string
    phone: string
    contactHours: string
    location: {
      lat: number
      lng: number
      address: string
    }
    specializations: Specialization[]
    certifications: Certification[]
    testimonials: Testimonial[]
    availability: Availability
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
  