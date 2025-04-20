"use client"

import { useState } from 'react';
import { FaSwimmer, FaTrophy, FaClock, FaStar, FaMapMarkerAlt, FaWater, FaSave, FaTimes } from 'react-icons/fa';
import CourseCard from '@/app/components/Course/CourseCard';

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

export default function EditCoachProfile() {
  const [coach, setCoach] = useState<SwimmingCoach>({
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
          address: 'Skyline Aquatic Center, Pool 2'
        }
      },
      // ... other courses
    ]
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>('');

  const handleEditStart = (field: string, value: any) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = (field: string) => {
    setCoach(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleArrayEdit = (field: string, index: number, value: string) => {
    const newArray = [...(coach[field as keyof SwimmingCoach] as string[])]; // ✅ Corrected here
    newArray[index] = value;
    setCoach(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleAddSpecialty = () => {
    setCoach(prev => ({
      ...prev,
      specialties: [...prev.specialties, 'New Specialty']
    }));
  };

  const handleRemoveSpecialty = (index: number) => {
    setCoach(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-sky-800">Edit Coach Profile</h1>
          <div className="flex gap-4">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <FaSave className="inline mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Editable Coach Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Coach Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <img 
                  src={coach.imageUrl} 
                  alt={coach.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-sky-700 hover:bg-sky-800 text-white p-2 rounded-full">
                Edit Photo
              </button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                {editingField === 'name' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-2xl font-bold bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full"
                    />
                    <button 
                      onClick={() => handleSave('name')}
                      className="bg-white text-sky-600 p-1 rounded"
                    >
                      <FaSave />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-white text-red-600 p-1 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <h2 
                    className="text-2xl font-bold cursor-pointer hover:underline"
                    onClick={() => handleEditStart('name', coach.name)}
                  >
                    {coach.name}
                  </h2>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-sky-200" />
                  {editingField === 'location' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-full"
                      />
                      <button 
                        onClick={() => handleSave('location')}
                        className="bg-white text-sky-600 p-1 rounded"
                      >
                        <FaSave />
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="bg-white text-red-600 p-1 rounded"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => handleEditStart('location', coach.location)}
                    >
                      {coach.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
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
              {editingField === 'lessonPrice' ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">$</span>
                  <input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(Number(e.target.value))}
                    className="text-2xl font-bold bg-white/20 border border-white/30 rounded px-2 py-1 text-white w-20"
                  />
                  <button 
                    onClick={() => handleSave('lessonPrice')}
                    className="bg-white text-sky-600 p-1 rounded"
                  >
                    <FaSave />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="bg-white text-red-600 p-1 rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <p 
                  className="text-2xl font-bold cursor-pointer hover:underline"
                  onClick={() => handleEditStart('lessonPrice', coach.lessonPrice)}
                >
                  ${coach.lessonPrice}<span className="text-sm font-normal">/lesson</span>
                </p>
              )}
            </div>
          </div>

          {/* Editable Coach Details */}
          <div className="p-6 space-y-8">
            {/* Certification & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <h3 className="flex items-center gap-2 text-sky-700 font-semibold">
                  <FaSwimmer />
                  <span>Certification</span>
                </h3>
                {editingField === 'certification' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="text-gray-700 w-full p-1 border rounded"
                    />
                    <button 
                      onClick={() => handleSave('certification')}
                      className="bg-sky-600 text-white p-1 rounded"
                    >
                      <FaSave />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <p 
                    className="mt-2 text-gray-700 cursor-pointer hover:underline"
                    onClick={() => handleEditStart('certification', coach.certification)}
                  >
                    {coach.certification}
                  </p>
                )}
              </div>
              
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <h3 className="flex items-center gap-2 text-sky-700 font-semibold">
                  <FaClock />
                  <span>Experience</span>
                </h3>
                {editingField === 'experienceYears' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(Number(e.target.value))}
                      className="text-gray-700 w-full p-1 border rounded"
                    />
                    <span>years</span>
                    <button 
                      onClick={() => handleSave('experienceYears')}
                      className="bg-sky-600 text-white p-1 rounded"
                    >
                      <FaSave />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <p 
                    className="mt-2 text-gray-700 cursor-pointer hover:underline"
                    onClick={() => handleEditStart('experienceYears', coach.experienceYears)}
                  >
                    {coach.experienceYears} years coaching
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">About Me</h3>
              {editingField === 'bio' ? (
                <div className="space-y-2">
                  <textarea
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-gray-700 w-full p-2 border rounded h-32"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave('bio')}
                      className="bg-sky-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p 
                  className="text-gray-700 leading-relaxed cursor-pointer hover:underline"
                  onClick={() => handleEditStart('bio', coach.bio)}
                >
                  {coach.bio}
                </p>
              )}
            </div>

            {/* Specialties */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-sky-800">Specialties</h3>
                <button 
                  onClick={handleAddSpecialty}
                  className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                >
                  + Add Specialty
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty, index) => (
                  <div key={index} className="relative group">
                    {editingField === `specialty-${index}` ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium"
                        />
                        <button 
                          onClick={() => {
                            handleArrayEdit('specialties', index, tempValue);
                            setEditingField(null);
                          }}
                          className="ml-1 bg-green-500 text-white p-1 rounded-full"
                        >
                          <FaSave size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            handleRemoveSpecialty(index);
                            setEditingField(null);
                          }}
                          className="ml-1 bg-red-500 text-white p-1 rounded-full"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span 
                          className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:underline"
                          onClick={() => handleEditStart(`specialty-${index}`, specialty)}
                        >
                          {specialty}
                        </span>
                      </div>
                    )}
                  </div>
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
                {coach.achievements.map((achievement, index) => (
                  <li key={index} className="group">
                    {editingField === `achievement-${index}` ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="w-full p-1 border rounded"
                        />
                        <button 
                          onClick={() => {
                            handleArrayEdit('achievements', index, tempValue);
                            setEditingField(null);
                          }}
                          className="bg-sky-600 text-white p-1 rounded"
                        >
                          <FaSave size={12} />
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="bg-gray-500 text-white p-1 rounded"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="cursor-pointer hover:underline"
                        onClick={() => handleEditStart(`achievement-${index}`, achievement)}
                      >
                        {achievement}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold text-sky-800 mb-2">Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coach.availability.map((slot, index) => (
                  <div key={index} className="relative">
                    {editingField === `availability-${index}` ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center font-medium w-full"
                        />
                        <button 
                          onClick={() => {
                            handleArrayEdit('availability', index, tempValue);
                            setEditingField(null);
                          }}
                          className="bg-sky-600 text-white p-2 rounded"
                        >
                          <FaSave size={12} />
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="bg-gray-500 text-white p-2 rounded"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="bg-sky-50 border border-sky-100 rounded-lg p-3 text-center font-medium cursor-pointer hover:underline"
                        onClick={() => handleEditStart(`availability-${index}`, slot)}
                      >
                        {slot}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaWater className="text-white" />
              <span>Featured Swimming Courses</span>
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coach.courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Manage Courses
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}