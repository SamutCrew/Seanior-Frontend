"use client"

import { FaSwimmer, FaTrophy, FaClock, FaStar, FaMapMarkerAlt, FaWater } from 'react-icons/fa';
import CourseCard from '@/app/components/Course/CourseCard'; // Adjust import path as needed

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Course {
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

interface SwimmingCoach {
  id: string;
  name: string;
  certification: string;
  experienceYears: number;
  specialties: string[];
  location: string;
  rating: number;
  lessonPrice: number;
  bio: string;
  achievements: string[];
  availability: string[];
  imageUrl: string;
  courses: Course[];
}

export default function CoachProfile() {
  const coach: SwimmingCoach = {
    id: 'coach-123',
    name: 'Alex Johnson',
    certification: 'ASCA Level 3 Certified',
    experienceYears: 12,
    specialties: [
      'Competitive Swimming',
      'Adult Beginners',
      'Stroke Correction',
      'Triathlon Training'
    ],
    location: 'Skyline Aquatic Center, Miami',
    rating: 4.9,
    lessonPrice: 65,
    bio: 'Former Olympic trialist with 12 years of coaching experience. Specialized in helping swimmers of all levels improve technique, endurance, and competitive performance. My teaching philosophy focuses on building confidence in the water while developing efficient, powerful strokes.',
    achievements: [
      '2022 Florida State Coach of the Year',
      'Trained 15 national qualifiers',
      'Red Cross Water Safety Instructor'
    ],
    availability: [
      'Monday: 3pm - 7pm',
      'Wednesday: 3pm - 7pm',
      'Saturday: 9am - 2pm'
    ],
    imageUrl: '/coach-alex.jpg',
    courses: [
      {
        id: 1,
        title: 'Freestyle Mastery',
        focus: 'Technique Improvement',
        level: 'Intermediate',
        duration: '8 weeks',
        schedule: 'Mon/Wed 5-6pm',
        instructor: 'Alex Johnson',
        rating: 4.8,
        students: 124,
        price: 299,
        location: {
          lat: 25.7617,
          lng: -80.1918,
          address: 'Skyline Aquatic Center'
        }
      },
      {
        id: 2,
        title: 'Adult Beginner Swim',
        focus: 'Water Confidence',
        level: 'Beginner',
        duration: '6 weeks',
        schedule: 'Tue/Thu 6-7pm',
        instructor: 'Alex Johnson',
        rating: 4.9,
        students: 89,
        price: 199,
        location: {
          lat: 25.7617,
          lng: -80.1918,
          address: 'Skyline Aquatic Center'
        }
      },
      {
        id: 3,
        title: 'Competitive Starts & Turns',
        focus: 'Race Techniques',
        level: 'Advanced',
        duration: '4 weeks',
        schedule: 'Sat 9-11am',
        instructor: 'Alex Johnson',
        rating: 4.7,
        students: 67,
        price: 349,
        location: {
          lat: 25.7617,
          lng: -80.1918,
          address: 'Skyline Aquatic Center'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-sky-800">Swimming Coach Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Coach Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Coach Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img 
                src={coach.imageUrl} 
                alt={coach.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{coach.name}</h2>
              <p className="flex items-center gap-1 mt-1">
                <FaMapMarkerAlt className="text-sky-200" />
                <span>{coach.location}</span>
              </p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`${i < Math.floor(coach.rating) ? 'text-yellow-300' : 'text-sky-200'} text-lg`} 
                  />
                ))}
                <span className="ml-2">{coach.rating} ({Math.floor(coach.rating * 23)} reviews)</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-sky-100">Starting at</p>
              <p className="text-2xl font-bold">${coach.lessonPrice}<span className="text-sm font-normal">/lesson</span></p>
            </div>
          </div>

          {/* Coach Details */}
          <div className="p-6 space-y-8">
            {/* Certification & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <h3 className="flex items-center gap-2 text-sky-700 font-semibold">
                  <FaSwimmer />
                  <span>Certification</span>
                </h3>
                <p className="mt-2 text-gray-700">{coach.certification}</p>
              </div>
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <h3 className="flex items-center gap-2 text-sky-700 font-semibold">
                  <FaClock />
                  <span>Experience</span>
                </h3>
                <p className="mt-2 text-gray-700">{coach.experienceYears} years coaching</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">About Me</h3>
              <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
            </div>

            {/* Specialties */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty) => (
                  <span 
                    key={specialty}
                    className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2 flex items-center gap-2">
                <FaTrophy />
                <span>Notable Achievements</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {coach.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coach.availability.map((slot) => (
                  <div 
                    key={slot}
                    className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center font-medium"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-sky-50 px-6 py-4 border-t border-sky-100 flex justify-end">
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
              Book a Lesson
            </button>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-black">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaWater className="text-sky-600" />
              <span>Featured Courses</span>
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coach.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {coach.courses.length > 3 && (
              <div className="mt-8 text-center">
                <button className="inline-flex items-center px-4 py-2 border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-50 transition-colors font-medium">
                  View All Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}