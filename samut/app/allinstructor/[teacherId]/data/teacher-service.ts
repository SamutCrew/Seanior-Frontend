import type { Teacher } from "@/types/instructor"
import { getUserData } from "@/api/user_api"

export const getTeacherById = async (id: string): Promise<Teacher> => {
  try {
    // Fetch the actual user data from the API
    const userData = await getUserData(id)

    // Transform user data to match Teacher interface
    return {
      id: userData.user_id || id,
      name: userData.name || "Instructor",
      profileImage: userData.profile_img || "/instructor-teaching.png",
      specialty: userData.description?.specialty || "Swimming Instructor",
      bio:
        typeof userData.description === "object"
          ? userData.description.bio || ""
          : typeof userData.description === "string"
            ? userData.description
            : "",
      teachingPhilosophy: "",
      styles:
        typeof userData.description === "object" && userData.description.styles
          ? Array.isArray(userData.description.styles)
            ? userData.description.styles
            : [userData.description.styles]
          : ["Freestyle", "Butterfly", "Backstroke", "Breaststroke"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      certification:
        typeof userData.description === "object" && userData.description.certification
          ? Array.isArray(userData.description.certification)
            ? userData.description.certification
            : [userData.description.certification]
          : [],
      rating: 4.5,
      experience: typeof userData.description === "object" ? userData.description.experience || 1 : 1,
      lessonType: "Private & Group Lessons",
      price: 75,
      email: userData.email || "",
      phone: userData.phone_number || "",
      contactHours:
        typeof userData.description === "object"
          ? userData.description.contactHours || "Monday to Friday, 9AM - 5PM"
          : "Monday to Friday, 9AM - 5PM",
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: userData.address || "Swimming Center",
      },
      specializations:
        typeof userData.description === "object" && Array.isArray(userData.description.specializations)
          ? userData.description.specializations
          : [
              {
                title: "Swimming Technique",
                description: "Specialized coaching for improving swimming technique.",
              },
            ],
      certifications: [
        {
          id: "cert1",
          name:
            typeof userData.description === "object" && userData.description.certification
              ? typeof userData.description.certification === "string"
                ? userData.description.certification
                : "Swimming Instructor Certification"
              : "Swimming Instructor Certification",
          issuer: "Swimming Association",
          issueDate: "January 2022",
          description: "Certification for swimming instruction.",
          logo: "/generic-certification-seal.png",
          skills: ["Swimming Instruction", "Water Safety"],
          verificationUrl: "https://example.com/verify",
        },
      ],
      testimonials: [
        {
          id: "test1",
          name: "Student",
          avatar: "/diverse-group.png",
          rating: 5,
          text: "Great instructor!",
          course: "Swimming Course",
          date: "June 15, 2023",
        },
      ],
      availability:
        typeof userData.description === "object" && userData.description.schedule
          ? userData.description.schedule
          : {
              monday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
              tuesday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
              wednesday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
              thursday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
              friday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
              saturday: [],
              sunday: [],
            },
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error)

    // Return fallback data if there's an error
    return {
      id,
      name: "Instructor",
      profileImage: "/swimming-instructor.png",
      specialty: "Swimming Instructor",
      bio: "Information unavailable at the moment.",
      teachingPhilosophy: "",
      styles: ["Freestyle", "Butterfly", "Backstroke", "Breaststroke"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      certification: ["Swimming Instructor Certification"],
      rating: 4.5,
      experience: 1,
      lessonType: "Private & Group Lessons",
      price: 75,
      email: "",
      phone: "",
      contactHours: "Monday to Friday, 9AM - 5PM",
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: "Swimming Center",
      },
      specializations: [
        {
          title: "Swimming Technique",
          description: "Specialized coaching for improving swimming technique.",
        },
      ],
      certifications: [
        {
          id: "cert1",
          name: "Swimming Instructor Certification",
          issuer: "Swimming Association",
          issueDate: "January 2022",
          description: "Certification for swimming instruction.",
          logo: "/generic-certification-seal.png",
          skills: ["Swimming Instruction", "Water Safety"],
          verificationUrl: "https://example.com/verify",
        },
      ],
      testimonials: [
        {
          id: "test1",
          name: "Student",
          avatar: "/diverse-group.png",
          rating: 5,
          text: "Great instructor!",
          course: "Swimming Course",
          date: "June 15, 2023",
        },
      ],
      availability: {
        monday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
        tuesday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
        wednesday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
        thursday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
        friday: [{ startTime: "9:00 AM", endTime: "5:00 PM", location: "Pool" }],
        saturday: [],
        sunday: [],
      },
    }
  }
}
