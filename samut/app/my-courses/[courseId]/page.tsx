"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Book, Calendar, Clock, MapPin, User, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { Button } from "@/components/Common/Button"
import LoadingPage from "@/components/Common/LoadingPage"
import CourseProgressOverview from "@/components/StudentProgress/CourseProgressOverview"
import WeeklyProgressList, { type WeeklyProgressItem } from "@/components/StudentProgress/WeeklyProgressList"
import ImageGalleryModal from "@/components/StudentProgress/ImageGalleryModal"
import ProgressTracker from "@/components/StudentProgress/ProgressTracker"
import type { Course } from "@/types/course"

// Mock data - replace with actual API call
const getCourseDetails = async (
  courseId: string,
): Promise<{
  course: Course
  weeklyUpdates: WeeklyProgressItem[]
  skills: { name: string; progress: number }[]
}> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock course data
  const courses = {
    "1": {
      id: 1,
      title: "Advanced Swimming Techniques",
      focus: "Freestyle & Butterfly",
      level: "Intermediate",
      duration: "12 weeks",
      schedule: "Mon, Wed 5:00 PM",
      instructor: "Sarah Johnson",
      instructorId: "instructor-1",
      instructorImage: "/female-swim-instructor.png",
      rating: 4.8,
      students: 12,
      price: 450,
      location: {
        address: "Aquatic Center, 123 Pool St",
      },
      courseType: "public-pool" as const,
      status: "in-progress" as const,
      description:
        "This advanced swimming course focuses on perfecting freestyle and butterfly techniques. Students will learn proper body positioning, advanced breathing techniques, and efficient stroke mechanics. The course is designed for intermediate swimmers looking to improve their speed, endurance, and overall technique.",
      image: "/advanced-swimming-class.png",
      progress: {
        overallCompletion: 65,
        modules: [
          {
            id: 1,
            title: "Freestyle Fundamentals",
            completion: 100,
            topics: [
              { id: 101, title: "Body Position", completed: true },
              { id: 102, title: "Arm Movement", completed: true },
              { id: 103, title: "Leg Kick", completed: true },
              { id: 104, title: "Breathing Technique", completed: true },
            ],
          },
          {
            id: 2,
            title: "Breathing Techniques",
            completion: 80,
            topics: [
              { id: 201, title: "Bilateral Breathing", completed: true },
              { id: 202, title: "Breath Control", completed: true },
              { id: 203, title: "Rhythm and Timing", completed: false },
              { id: 204, title: "Endurance Training", completed: true },
            ],
          },
          {
            id: 3,
            title: "Butterfly Stroke",
            completion: 40,
            topics: [
              { id: 301, title: "Body Undulation", completed: true },
              { id: 302, title: "Arm Recovery", completed: true },
              { id: 303, title: "Dolphin Kick", completed: false },
              { id: 304, title: "Stroke Timing", completed: false },
            ],
          },
          {
            id: 4,
            title: "Advanced Turns",
            completion: 0,
            topics: [
              { id: 401, title: "Flip Turns", completed: false },
              { id: 402, title: "Open Turns", completed: false },
              { id: 403, title: "Underwater Dolphin Kicks", completed: false },
              { id: 404, title: "Turn Efficiency", completed: false },
            ],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
    },
    "2": {
      id: 2,
      title: "Water Safety & Rescue",
      focus: "Safety Techniques",
      level: "Beginner",
      duration: "8 weeks",
      schedule: "Tue, Thu 6:30 PM",
      instructor: "Michael Chen",
      instructorId: "instructor-2",
      instructorImage: "/male-swim-instructor.png",
      rating: 4.6,
      students: 15,
      price: 350,
      location: {
        address: "Community Pool, 456 Swim Ave",
      },
      courseType: "public-pool" as const,
      status: "in-progress" as const,
      description:
        "Learn essential water safety skills and basic rescue techniques. This course covers personal water safety, recognizing and responding to aquatic emergencies, and basic rescue techniques. Perfect for beginners who want to feel more confident and safe around water.",
      image: "/water-safety-class.png",
      progress: {
        overallCompletion: 30,
        modules: [
          {
            id: 1,
            title: "Basic Water Safety",
            completion: 100,
            topics: [
              { id: 101, title: "Water Awareness", completed: true },
              { id: 102, title: "Personal Safety", completed: true },
              { id: 103, title: "Safety Equipment", completed: true },
            ],
          },
          {
            id: 2,
            title: "Rescue Techniques",
            completion: 50,
            topics: [
              { id: 201, title: "Reaching Assists", completed: true },
              { id: 202, title: "Throwing Assists", completed: true },
              { id: 203, title: "Wading Assists", completed: false },
              { id: 204, title: "Watercraft Rescue", completed: false },
            ],
          },
          {
            id: 3,
            title: "CPR Basics",
            completion: 0,
            topics: [
              { id: 301, title: "CPR Overview", completed: false },
              { id: 302, title: "Adult CPR", completed: false },
              { id: 303, title: "Child CPR", completed: false },
            ],
          },
          {
            id: 4,
            title: "Emergency Response",
            completion: 0,
            topics: [
              { id: 401, title: "Emergency Action Plans", completed: false },
              { id: 402, title: "First Aid Basics", completed: false },
              { id: 403, title: "Communication", completed: false },
            ],
          },
        ],
        lastUpdated: new Date().toISOString(),
      },
    },
    "3": {
      id: 3,
      title: "Swimming Fundamentals",
      focus: "Basics & Confidence",
      level: "Beginner",
      duration: "10 weeks",
      schedule: "Completed",
      instructor: "David Wilson",
      instructorId: "instructor-3",
      instructorImage: "/swim-coach.png",
      rating: 4.9,
      students: 10,
      price: 300,
      location: {
        address: "Sunshine Pool, 789 Water Ln",
      },
      courseType: "public-pool" as const,
      status: "completed" as const,
      description:
        "A comprehensive introduction to swimming for beginners. This course focuses on building water confidence, learning basic strokes, and developing fundamental swimming skills. Perfect for those new to swimming or looking to overcome water anxiety.",
      image: "/beginner-swimming-class.png",
      progress: {
        overallCompletion: 100,
        modules: [
          {
            id: 1,
            title: "Water Confidence",
            completion: 100,
            topics: [
              { id: 101, title: "Water Entry", completed: true },
              { id: 102, title: "Breath Control", completed: true },
              { id: 103, title: "Floating", completed: true },
            ],
          },
          {
            id: 2,
            title: "Basic Strokes",
            completion: 100,
            topics: [
              { id: 201, title: "Front Crawl", completed: true },
              { id: 202, title: "Backstroke", completed: true },
              { id: 203, title: "Breaststroke", completed: true },
            ],
          },
          {
            id: 3,
            title: "Floating Techniques",
            completion: 100,
            topics: [
              { id: 301, title: "Back Float", completed: true },
              { id: 302, title: "Front Float", completed: true },
              { id: 303, title: "Treading Water", completed: true },
            ],
          },
          {
            id: 4,
            title: "Basic Diving",
            completion: 100,
            topics: [
              { id: 401, title: "Sitting Dive", completed: true },
              { id: 402, title: "Kneeling Dive", completed: true },
              { id: 403, title: "Standing Dive", completed: true },
            ],
          },
        ],
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  }

  const courseData = courses[courseId as keyof typeof courses]

  if (!courseData) {
    throw new Error("Course not found")
  }

  // Mock weekly updates
  const weeklyUpdates: Record<string, WeeklyProgressItem[]> = {
    "1": [
      {
        id: 101,
        week: 1,
        session: 1,
        title: "Introduction to Advanced Techniques",
        date: "Sep 5, 2023",
        content:
          "Today we focused on body positioning for freestyle. Student showed excellent progress in maintaining proper horizontal body position and head alignment. We worked on reducing drag and improving streamlining.",
        achievements: ["Mastered horizontal body position", "Improved head alignment", "Reduced body rotation"],
        images: ["/freestyle-swimming-lesson.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Body Position", completed: true },
          { name: "Head Alignment", completed: true },
          { name: "Streamlining", completed: true },
        ],
      },
      {
        id: 102,
        week: 2,
        session: 2,
        title: "Freestyle Arm Technique",
        date: "Sep 12, 2023",
        content:
          "We worked on arm entry and catch phase of freestyle. Student is showing good improvement in high elbow position and proper hand entry. Still needs work on the pull-through phase to maximize propulsion.",
        achievements: [
          "Improved arm entry technique",
          "Better high elbow position",
          "Still struggling with pull-through phase",
        ],
        images: ["/freestyle-swimming.png", "/swimming-breathing-training.png"],
        progress: 80,
        progressItems: [
          { name: "Arm Entry", completed: true },
          { name: "High Elbow", completed: true },
          { name: "Pull-through", completed: false },
        ],
      },
      {
        id: 103,
        week: 3,
        session: 3,
        title: "Breathing Techniques",
        date: "Sep 19, 2023",
        content:
          "Today's session focused on bilateral breathing. Student is making good progress with breath timing but still needs to work on keeping one goggle in the water during breath. We practiced breathing drills with fins to help maintain body position.",
        achievements: [
          "Improved breath timing",
          "Better rhythm with bilateral breathing",
          "Still struggling with head position during breath",
        ],
        images: ["/swimming-breathing-training.png", "/freestyle-swimming-lesson.png"],
        progress: 70,
        progressItems: [
          { name: "Breath Timing", completed: true },
          { name: "Bilateral Pattern", completed: true },
          { name: "Head Position", completed: false },
        ],
      },
      {
        id: 104,
        week: 4,
        session: 4,
        title: "Butterfly Body Undulation",
        date: "Sep 26, 2023",
        content:
          "Introduction to butterfly stroke focusing on body undulation. Student is showing good understanding of the wave-like motion but needs more practice to make it fluid. We used dolphin kick drills with kickboard to reinforce proper technique.",
        achievements: [
          "Good understanding of undulation concept",
          "Improved dolphin kick",
          "Still struggling with timing the undulation",
        ],
        images: ["/butterfly-stroke-lesson.png", "/swimming-pool-training.png"],
        progress: 60,
        progressItems: [
          { name: "Undulation Concept", completed: true },
          { name: "Dolphin Kick", completed: true },
          { name: "Timing", completed: false },
        ],
      },
      {
        id: 105,
        week: 5,
        session: 5,
        title: "Butterfly Arm Movement",
        date: "Oct 3, 2023",
        content:
          "Focused on butterfly arm recovery and entry. Student is making progress with the arm movement but coordination with the body undulation needs work. We practiced arm-only drills with pull buoy to isolate the movement.",
        achievements: ["Improved arm recovery", "Better arm entry", "Still struggling with arm-body coordination"],
        images: ["/butterfly-stroke-lesson.png", "/swimming-pool-training.png"],
        progress: 40,
        progressItems: [
          { name: "Arm Recovery", completed: true },
          { name: "Arm Entry", completed: true },
          { name: "Arm-Body Coordination", completed: false },
        ],
      },
    ],
    "2": [
      {
        id: 201,
        week: 1,
        session: 1,
        title: "Water Safety Introduction",
        date: "Oct 2, 2023",
        content:
          "Introduction to water safety principles. Covered the importance of awareness, personal safety, and basic safety equipment. Student demonstrated good understanding of safety concepts.",
        achievements: [
          "Excellent understanding of safety principles",
          "Good knowledge of safety equipment",
          "Active participation in discussions",
        ],
        images: ["/water-safety-class.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Safety Principles", completed: true },
          { name: "Equipment Knowledge", completed: true },
          { name: "Risk Assessment", completed: true },
        ],
      },
      {
        id: 202,
        week: 2,
        session: 2,
        title: "Reaching and Throwing Assists",
        date: "Oct 9, 2023",
        content:
          "Practiced reaching and throwing rescue techniques. Student showed good form with reaching assists using pole and shepherd's crook. Throwing rescue practice with ring buoy was successful at short distances but needs work at longer ranges.",
        achievements: [
          "Mastered reaching assists",
          "Good accuracy with throwing at short range",
          "Still struggling with long-distance throws",
        ],
        images: ["/water-safety-class.png", "/swimming-pool-training.png"],
        progress: 80,
        progressItems: [
          { name: "Reaching Assists", completed: true },
          { name: "Throwing Technique", completed: true },
          { name: "Long-distance Accuracy", completed: false },
        ],
      },
      {
        id: 203,
        week: 3,
        session: 3,
        title: "Wading Assists and Self-Rescue",
        date: "Oct 16, 2023",
        content:
          "Today we covered wading assists and self-rescue techniques. Student is showing good progress with wading assists in shallow water but needs more confidence. Self-rescue techniques like floating and treading water were well executed.",
        achievements: [
          "Good wading technique in shallow water",
          "Excellent floating for self-rescue",
          "Strong treading water skills",
        ],
        images: ["/water-safety-class.png", "/swimming-pool-training.png"],
        progress: 90,
        progressItems: [
          { name: "Wading Technique", completed: true },
          { name: "Self-Rescue", completed: true },
          { name: "Deep Water Confidence", completed: false },
        ],
      },
    ],
    "3": [
      {
        id: 301,
        week: 1,
        session: 1,
        title: "Water Confidence",
        date: "Jun 5, 2023",
        content:
          "First session focused on building water confidence. Student initially showed some anxiety but made excellent progress by the end of the session. Successfully submerged face in water and practiced controlled breathing.",
        achievements: ["Overcame initial water anxiety", "Successful face submersion", "Learned controlled breathing"],
        images: ["/beginner-swimming-class.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Water Entry", completed: true },
          { name: "Face Submersion", completed: true },
          { name: "Controlled Breathing", completed: true },
        ],
      },
      {
        id: 302,
        week: 2,
        session: 2,
        title: "Floating Techniques",
        date: "Jun 12, 2023",
        content:
          "Focused on floating techniques. Student mastered back float with excellent body position and relaxation. Front float still needs some work on maintaining proper head position, but overall good progress.",
        achievements: ["Mastered back float", "Good relaxation in water", "Improved front float with assistance"],
        images: ["/beginner-swimming-class.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Back Float", completed: true },
          { name: "Front Float", completed: true },
          { name: "Recovery to Standing", completed: true },
        ],
      },
      {
        id: 303,
        week: 3,
        session: 3,
        title: "Kicking Techniques",
        date: "Jun 19, 2023",
        content:
          "Today we worked on kicking techniques with kickboard. Student showed excellent flutter kick for freestyle with good ankle flexibility. Whip kick for breaststroke needs more practice to achieve proper form and power.",
        achievements: ["Strong flutter kick", "Good ankle flexibility", "Improving whip kick technique"],
        images: ["/beginner-swimming-class.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Flutter Kick", completed: true },
          { name: "Whip Kick", completed: true },
          { name: "Kick Timing", completed: true },
        ],
      },
      {
        id: 304,
        week: 4,
        session: 4,
        title: "Arm Strokes Introduction",
        date: "Jun 26, 2023",
        content:
          "Introduction to arm strokes for freestyle and backstroke. Student picked up the freestyle arm movement quickly with good form. Backstroke arm movement needs more practice to maintain proper entry and pull pattern.",
        achievements: [
          "Good freestyle arm technique",
          "Understanding of arm movement patterns",
          "Improving backstroke arm entry",
        ],
        images: ["/beginner-swimming-class.png", "/swimming-pool-training.png"],
        progress: 100,
        progressItems: [
          { name: "Freestyle Arms", completed: true },
          { name: "Backstroke Arms", completed: true },
          { name: "Arm-Breathing Coordination", completed: true },
        ],
      },
    ],
  }

  // Mock skills assessment
  const skillsAssessment: Record<string, { name: string; progress: number }[]> = {
    "1": [
      { name: "Freestyle Technique", progress: 85 },
      { name: "Butterfly Technique", progress: 40 },
      { name: "Breathing Control", progress: 75 },
      { name: "Endurance", progress: 60 },
      { name: "Speed", progress: 55 },
    ],
    "2": [
      { name: "Water Safety Knowledge", progress: 90 },
      { name: "Rescue Techniques", progress: 65 },
      { name: "Self-Rescue Skills", progress: 80 },
      { name: "Emergency Response", progress: 30 },
      { name: "CPR Basics", progress: 0 },
    ],
    "3": [
      { name: "Water Confidence", progress: 100 },
      { name: "Floating", progress: 100 },
      { name: "Basic Strokes", progress: 100 },
      { name: "Breathing Technique", progress: 95 },
      { name: "Diving", progress: 90 },
    ],
  }

  return {
    course: courseData,
    weeklyUpdates: weeklyUpdates[courseId] || [],
    skills: skillsAssessment[courseId] || [],
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [weeklyUpdates, setWeeklyUpdates] = useState<WeeklyProgressItem[]>([])
  const [skills, setSkills] = useState<{ name: string; progress: number }[]>([])

  // For image gallery
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryTitle, setGalleryTitle] = useState("")

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { course, weeklyUpdates, skills } = await getCourseDetails(params.courseId as string)
        setCourse(course)
        setWeeklyUpdates(weeklyUpdates)
        setSkills(skills)
      } catch (error) {
        console.error("Failed to fetch course details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.courseId) {
      fetchCourseDetails()
    }
  }, [params.courseId])

  const handleViewImage = (update: WeeklyProgressItem, index: number) => {
    setGalleryImages(update.images)
    setCurrentImageIndex(index)
    setGalleryTitle(`Session ${update.session || update.week}: ${update.title}`)
    setShowGallery(true)
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  if (loading) {
    return <LoadingPage />
  }

  if (!course) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"} p-8`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`p-8 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Course Not Found
            </h2>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              The course you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button variant={isDarkMode ? "gradient" : "primary"} onClick={() => router.push("/my-courses")}>
              Back to My Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Course Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('/cerulean-flow.png')] bg-cover bg-center"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => router.push("/my-courses")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Courses
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-1 rounded-full bg-blue-700 text-white text-xs font-medium">{course.level}</div>
                {course.status === "in-progress" ? (
                  <div className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> In Progress
                  </div>
                ) : (
                  <div className="px-2 py-1 rounded-full bg-green-600 text-white text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </div>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg text-blue-100 mb-4">{course.focus}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Instructor</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Duration</p>
                    <p className="font-medium">{course.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Schedule</p>
                    <p className="font-medium">{course.schedule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-100">Location</p>
                    <p className="font-medium">{course.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 lg:w-80">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={course.image || "/placeholder.svg?query=swimming lesson"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Progress Overview */}
            <CourseProgressOverview
              courseName={course.title}
              studentName="Your"
              overallProgress={course.progress?.overallCompletion || 0}
              modules={course.progress?.modules || []}
              lastUpdated={course.progress?.lastUpdated}
            />

            {/* Weekly Progress Updates */}
            <WeeklyProgressList
              updates={weeklyUpdates}
              isStudentView={true}
              onViewImage={handleViewImage}
              totalSessions={course.duration ? Number.parseInt(course.duration) : 0}
            />
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-8">
            {/* Course Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
            >
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                <Book className={`w-5 h-5 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`} />
                About This Course
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {course.description || "No description available for this course."}
              </p>
            </motion.div>

            {/* Skills Assessment */}
            <ProgressTracker
              skills={skills}
              overallProgress={course.progress?.overallCompletion || 0}
              lastUpdated={course.progress?.lastUpdated}
              isStudentView={true}
            />

            {/* Course Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
            >
              <h2
                className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                <Calendar className={`w-5 h-5 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`} />
                Course Gallery
              </h2>

              {weeklyUpdates.some((update) => update.images && update.images.length > 0) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {weeklyUpdates
                    .flatMap((update) =>
                      update.images.map((image, index) => ({
                        image,
                        update,
                        index,
                      })),
                    )
                    .slice(0, 6)
                    .map((item, i) => (
                      <div
                        key={i}
                        className="relative aspect-video rounded-md overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
                        onClick={() => handleViewImage(item.update, item.index)}
                      >
                        <Image
                          src={item.image || "/placeholder.svg?query=swim lesson"}
                          alt={`Course image ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <p className={`text-center py-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No images available for this course yet.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGalleryModal
          images={galleryImages}
          currentIndex={currentImageIndex}
          onClose={() => setShowGallery(false)}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          title={galleryTitle}
        />
      )}
    </div>
  )
}
