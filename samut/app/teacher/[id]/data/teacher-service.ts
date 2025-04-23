import type { Teacher } from "@/types/teacher"

// This would be replaced with an actual API call in a real application
export const getTeacherById = async (id: string): Promise<Teacher> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return mock data for the teacher
  return {
    id,
    name: "Michael Phelps",
    profileImage: "/confident-swim-coach.png",
    specialty: "Olympic Swimming Coach",
    bio: "As a former Olympic gold medalist, I bring over 15 years of competitive swimming experience to my teaching. I specialize in helping swimmers of all levels perfect their technique and achieve their personal goals, whether that's learning to swim for the first time or preparing for competitive events. My approach combines technical precision with a supportive, encouraging environment that makes learning enjoyable and effective.",
    teachingPhilosophy:
      "I believe that every student has unique potential. My teaching approach focuses on building confidence in the water first, then developing proper technique through personalized instruction. Swimming should be both challenging and enjoyable, and I strive to create a positive learning environment where students feel motivated to push their boundaries.",
    styles: ["Freestyle", "Butterfly", "Backstroke", "Breaststroke"],
    levels: ["Beginner", "Intermediate", "Advanced", "Competition"],
    certification: ["ASCA Level 5", "Red Cross WSI", "USA Swimming"],
    rating: 4.9,
    experience: 15,
    lessonType: "Private & Group Lessons",
    price: 85,
    email: "michael.phelps@example.com",
    phone: "(555) 123-4567",
    contactHours: "Monday to Friday, 9AM - 5PM",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "Aquatic Center, Los Angeles, CA",
    },
    specializations: [
      {
        title: "Competition Training",
        description: "Specialized coaching for competitive swimmers looking to improve race times and technique.",
      },
      {
        title: "Adult Learn-to-Swim",
        description: "Patient, supportive instruction for adults who want to overcome fear of water and learn to swim.",
      },
      {
        title: "Stroke Refinement",
        description:
          "Technical analysis and correction to improve efficiency and speed in all four competitive strokes.",
      },
      {
        title: "Youth Development",
        description: "Age-appropriate instruction to build strong foundations for young swimmers ages 5-12.",
      },
    ],
    certifications: [
      {
        id: "cert1",
        name: "ASCA Level 5 Coach Certification",
        issuer: "American Swimming Coaches Association",
        issueDate: "January 2018",
        description:
          "Highest level of certification for swimming coaches, recognizing extensive experience and success in competitive coaching.",
        logo: "/generic-certification-seal.png",
        skills: ["Advanced Technique Analysis", "Training Program Design", "Competition Strategy"],
        verificationUrl: "https://example.com/verify/asca",
      },
      {
        id: "cert2",
        name: "Water Safety Instructor",
        issuer: "American Red Cross",
        issueDate: "March 2015",
        expiryDate: "March 2025",
        description: "Certification to teach swimming lessons and water safety courses to people of all ages.",
        logo: "/generic-water-safety-instructor-symbol.png",
        skills: ["Water Safety", "Swim Instruction", "Rescue Techniques"],
        verificationUrl: "https://example.com/verify/redcross",
      },
      {
        id: "cert3",
        name: "USA Swimming Coach Membership",
        issuer: "USA Swimming",
        issueDate: "September 2016",
        expiryDate: "September 2024",
        description: "Active coach membership with USA Swimming, including background checks and safety training.",
        logo: "/abstract-swirls-water.png",
        skills: ["Competition Rules", "Athlete Development", "Team Management"],
        verificationUrl: "https://example.com/verify/usaswimming",
      },
    ],
    testimonials: [
      {
        id: "test1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100&query=woman portrait",
        rating: 5,
        text: "Michael completely transformed my swimming. I went from barely being able to swim a lap to completing my first triathlon in just 6 months! His patience and technical expertise made all the difference.",
        course: "Adult Intermediate Swimming",
        date: "June 15, 2023",
      },
      {
        id: "test2",
        name: "David Chen",
        avatar: "/placeholder.svg?height=100&width=100&query=man portrait",
        rating: 5,
        text: "My son has been taking lessons with Michael for a year, and the improvement is remarkable. He went from being afraid of the water to competing in local swim meets. Michael has a special way with kids that builds confidence.",
        course: "Youth Competition Prep",
        date: "March 22, 2023",
      },
      {
        id: "test3",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=100&width=100&query=woman portrait",
        rating: 4,
        text: "As a former collegiate swimmer, I was looking for someone who could help refine my technique. Michael's attention to detail and ability to break down complex movements has helped me drop significant time in my events.",
        course: "Advanced Stroke Technique",
        date: "November 5, 2022",
      },
      {
        id: "test4",
        name: "Robert Williams",
        avatar: "/placeholder.svg?height=100&width=100&query=man portrait",
        rating: 5,
        text: "I started lessons with Michael at 45 years old, never having learned to swim properly. His patient approach and clear instruction made the learning process enjoyable. I can now confidently swim laps for exercise.",
        course: "Adult Beginner Swimming",
        date: "August 17, 2022",
      },
    ],
    availability: {
      monday: [
        { startTime: "9:00 AM", endTime: "11:00 AM", location: "Main Pool" },
        { startTime: "3:00 PM", endTime: "7:00 PM", location: "Olympic Pool" },
      ],
      tuesday: [{ startTime: "10:00 AM", endTime: "2:00 PM", location: "Main Pool" }],
      wednesday: [
        { startTime: "9:00 AM", endTime: "11:00 AM", location: "Main Pool" },
        { startTime: "3:00 PM", endTime: "7:00 PM", location: "Olympic Pool" },
      ],
      thursday: [{ startTime: "10:00 AM", endTime: "2:00 PM", location: "Main Pool" }],
      friday: [
        { startTime: "9:00 AM", endTime: "11:00 AM", location: "Main Pool" },
        { startTime: "3:00 PM", endTime: "6:00 PM", location: "Olympic Pool" },
      ],
      saturday: [{ startTime: "10:00 AM", endTime: "2:00 PM", location: "Main Pool" }],
      sunday: [],
    },
  }
}
