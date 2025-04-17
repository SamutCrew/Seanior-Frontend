"use client"

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCrosshairs } from 'react-icons/fa';
import { TeacherCard } from '../components/Teachers/TeacherCard';
import CourseCard from '../components/Course/CourseCard';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('../components/Googlemap/map'), { 
  ssr: false,
  loading: () => <p>Loading map...</p>
});

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Teacher {
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

// Helper function to calculate distance between two coordinates (in km)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'teacher' | 'course'>('teacher');
  
  // Separate filter states for teachers and courses
  const [teacherFilters, setTeacherFilters] = useState({
    style: '',
    level: '',
    lessonType: '',
    certification: '',
    minRating: 0,
    priceRange: '',
    maxDistance: 0,
  });

  const [courseFilters, setCourseFilters] = useState({
    focus: '',
    level: '',
    duration: '',
    schedule: '',
    minRating: 0,
    priceRange: '',
    maxDistance: 0,
  });

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  // Teacher data with swimming-specific attributes
  const teachers: Teacher[] = [
    { 
      id: 1, 
      name: 'Michael Phelps', 
      specialty: 'Competitive Swimming', 
      styles: ['Freestyle', 'Butterfly'], 
      levels: ['Intermediate', 'Advanced'], 
      certification: ['ASCA', 'RedCross'], 
      rating: 4.9, 
      experience: 15, 
      image: '/teacher1.jpg', 
      bio: 'Olympic gold medalist specializing in competitive swimming techniques', 
      lessonType: 'Private', 
      price: 80,
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' } 
    },
    { 
      id: 2, 
      name: 'Katie Ledecky', 
      specialty: 'Freestyle Technique', 
      styles: ['Freestyle'], 
      levels: ['Beginner', 'Intermediate', 'Advanced'], 
      certification: ['USMS', 'RedCross'], 
      rating: 4.8, 
      experience: 10, 
      image: '/teacher2.jpg', 
      bio: 'World record holder focusing on freestyle technique and endurance', 
      lessonType: 'Group', 
      price: 65,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
    },
    // Add more teachers...
  ];

  // Course data with swimming-specific attributes
  const courses: Course[] = [
    { 
      id: 1, 
      title: 'Freestyle Mastery', 
      focus: 'Technique', 
      level: 'Intermediate', 
      duration: '8 weeks', 
      schedule: 'Mon/Wed 6-7pm', 
      instructor: 'Michael Phelps', 
      rating: 4.7, 
      students: 12, 
      price: 400,
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' } 
    },
    { 
      id: 2, 
      title: 'Beginner Swimming', 
      focus: 'Fundamentals', 
      level: 'Beginner', 
      duration: '6 weeks', 
      schedule: 'Tue/Thu 5-6pm', 
      instructor: 'Katie Ledecky', 
      rating: 4.5, 
      students: 8, 
      price: 300,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
    },
    // Add more courses...
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Your current location"
        };
        setUserLocation(location);
        setSelectedLocation(location);
        setMapCenter({ lat: location.lat, lng: location.lng });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location");
        setIsLoadingLocation(false);
      }
    );
  };

  // Handle map click to select a new location
  const handleMapClick = (e: any) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      address: "Selected location"
    };
    setSelectedLocation(newLocation);
    setUserLocation(newLocation);
  };

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
    if (!showMap && userLocation) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
    }
  };

  // Filter teachers based on search term and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = teacher.name.toLowerCase().includes(term) || 
                         teacher.specialty.toLowerCase().includes(term);
    
    const matchesStyle = teacherFilters.style === '' || 
                        teacher.styles.includes(teacherFilters.style);
    const matchesLevel = teacherFilters.level === '' || 
                        teacher.levels.includes(teacherFilters.level);
    const matchesLessonType = teacherFilters.lessonType === '' || 
                            teacher.lessonType === teacherFilters.lessonType;
    const matchesCertification = teacherFilters.certification === '' || 
                               teacher.certification.includes(teacherFilters.certification);
    const matchesRating = teacher.rating >= teacherFilters.minRating;
    
    // Price range filter
    let matchesPrice = true;
    if (teacherFilters.priceRange) {
      const [min, max] = teacherFilters.priceRange.split('-').map(Number);
      matchesPrice = teacher.price >= min && 
                    (isNaN(max) || teacher.price <= max);
    }
    
    // Distance filter
    let matchesDistance = true;
    if (teacherFilters.maxDistance > 0 && userLocation) {
      const distance = getDistance(
        userLocation.lat, 
        userLocation.lng, 
        teacher.location.lat, 
        teacher.location.lng
      );
      matchesDistance = distance <= teacherFilters.maxDistance;
    }

    return matchesSearch && matchesStyle && matchesLevel && 
           matchesLessonType && matchesCertification && 
           matchesRating && matchesPrice && matchesDistance;
  });

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(term) || 
                        course.focus.toLowerCase().includes(term);
    
    const matchesFocus = courseFilters.focus === '' || 
                        course.focus === courseFilters.focus;
    const matchesLevel = courseFilters.level === '' || 
                        course.level === courseFilters.level;
    const matchesDuration = courseFilters.duration === '' || 
                          course.duration === courseFilters.duration;
    const matchesSchedule = courseFilters.schedule === '' || 
                          course.schedule.includes(courseFilters.schedule);
    const matchesRating = course.rating >= courseFilters.minRating;
    
    // Price range filter
    let matchesPrice = true;
    if (courseFilters.priceRange) {
      const [min, max] = courseFilters.priceRange.split('-').map(Number);
      matchesPrice = course.price >= min && 
                   (isNaN(max) || course.price <= max);
    }
    
    // Distance filter
    let matchesDistance = true;
    if (courseFilters.maxDistance > 0 && userLocation) {
      const distance = getDistance(
        userLocation.lat, 
        userLocation.lng, 
        course.location.lat, 
        course.location.lng
      );
      matchesDistance = distance <= courseFilters.maxDistance;
    }

    return matchesSearch && matchesFocus && matchesLevel && 
           matchesDuration && matchesSchedule && 
           matchesRating && matchesPrice && matchesDistance;
  });

  const resultsCount = searchType === 'teacher' ? filteredTeachers.length : filteredCourses.length;
  const resultsText = searchType === 'teacher' ? 'Teachers' : 'Courses';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <br/>
      <br/>
      <br/>
      <div className="max-w-7xl mx-auto mt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Swimming Instructors & Courses</h1>
          <p className="text-lg text-gray-600">Discover the perfect swimming teacher or program for your needs</p>
        </div>

        {/* Combined Search Bar */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSearchType('teacher')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  searchType === 'teacher' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Search Teachers
              </button>
              <button
                onClick={() => setSearchType('course')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  searchType === 'course' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Search Courses
              </button>
            </div>
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchType === 'teacher' ? "Search swimming teachers by name or specialty..." : "Search swimming courses by title or focus..."}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <input
              type="text"
              className="w-full p-3 border-2 border-black rounded-lg text-black font-semibold text-center bg-white shadow-md"
              placeholder="Search results will appear below..."
              readOnly
              value={searchTerm ? `${resultsCount} ${resultsText.toLowerCase()} matching: ${searchTerm}` : ''}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-700">Filters</h3>
          </div>

          {searchType === 'teacher' ? (
            /* Teacher Filters */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Swimming Style</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.style}
                  onChange={(e) => setTeacherFilters({...teacherFilters, style: e.target.value})}
                >
                  <option value="">All Styles</option>
                  <option value="Freestyle">Freestyle</option>
                  <option value="Breaststroke">Breaststroke</option>
                  <option value="Backstroke">Backstroke</option>
                  <option value="Butterfly">Butterfly</option>
                  <option value="Medley">Medley</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teaches Level</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.level}
                  onChange={(e) => setTeacherFilters({...teacherFilters, level: e.target.value})}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.lessonType}
                  onChange={(e) => setTeacherFilters({...teacherFilters, lessonType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Private">Private Lessons</option>
                  <option value="Group">Group Lessons</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certification</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.certification}
                  onChange={(e) => setTeacherFilters({...teacherFilters, certification: e.target.value})}
                >
                  <option value="">Any Certification</option>
                  <option value="ASCA">ASCA Certified</option>
                  <option value="RedCross">Red Cross Certified</option>
                  <option value="USMS">USMS Certified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.minRating}
                  onChange={(e) => setTeacherFilters({...teacherFilters, minRating: Number(e.target.value)})}
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={teacherFilters.priceRange}
                  onChange={(e) => setTeacherFilters({...teacherFilters, priceRange: e.target.value})}
                >
                  <option value="">Any Price</option>
                  <option value="0-50">$0-$50/hr</option>
                  <option value="50-80">$50-$80/hr</option>
                  <option value="80-120">$80-$120/hr</option>
                  <option value="120-">$120+/hr</option>
                </select>
              </div>
            </div>
          ) : (
            /* Course Filters */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Focus</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.focus}
                  onChange={(e) => setCourseFilters({...courseFilters, focus: e.target.value})}
                >
                  <option value="">All Focus Areas</option>
                  <option value="Technique">Technique Improvement</option>
                  <option value="Endurance">Endurance Training</option>
                  <option value="Competition">Competition Prep</option>
                  <option value="Safety">Water Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.level}
                  onChange={(e) => setCourseFilters({...courseFilters, level: e.target.value})}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.duration}
                  onChange={(e) => setCourseFilters({...courseFilters, duration: e.target.value})}
                >
                  <option value="">Any Duration</option>
                  <option value="4 weeks">4 Weeks</option>
                  <option value="6 weeks">6 Weeks</option>
                  <option value="8 weeks">8 Weeks</option>
                  <option value="12 weeks">12 Weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.schedule}
                  onChange={(e) => setCourseFilters({...courseFilters, schedule: e.target.value})}
                >
                  <option value="">Any Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.minRating}
                  onChange={(e) => setCourseFilters({...courseFilters, minRating: Number(e.target.value)})}
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  value={courseFilters.priceRange}
                  onChange={(e) => setCourseFilters({...courseFilters, priceRange: e.target.value})}
                >
                  <option value="">Any Price</option>
                  <option value="0-200">$0-$200</option>
                  <option value="200-400">$200-$400</option>
                  <option value="400-600">$400-$600</option>
                  <option value="600-">$600+</option>
                </select>
              </div>
            </div>
          )}

          {/* Common Location Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
            <div className="flex">
              <select
                className="flex-1 border border-gray-300 rounded-l-md p-2 bg-white text-black"
                value={searchType === 'teacher' ? teacherFilters.maxDistance : courseFilters.maxDistance}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  searchType === 'teacher' 
                    ? setTeacherFilters({...teacherFilters, maxDistance: value})
                    : setCourseFilters({...courseFilters, maxDistance: value});
                }}
              >
                <option value="0">Any Distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
              <button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="flex items-center justify-center px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoadingLocation ? 'Locating...' : <><FaCrosshairs className="mr-1" /> My Location</>}
              </button>
            </div>
            <button
              onClick={toggleMap}
              className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              <FaMapMarkerAlt className="mr-1" />
              {showMap ? 'Hide Map' : 'Show Map to Select Location'}
            </button>
            {locationError && (
              <p className="mt-1 text-sm text-red-600">{locationError}</p>
            )}
            {(userLocation || selectedLocation) && (
              <p className="mt-1 text-sm text-green-600">
                {userLocation === selectedLocation ? 'Using your current location' : 'Using selected location'}
                {searchType === 'teacher' 
                  ? teacherFilters.maxDistance > 0 
                    ? ` - Showing teachers within ${teacherFilters.maxDistance} km` 
                    : ''
                  : courseFilters.maxDistance > 0 
                    ? ` - Showing courses within ${courseFilters.maxDistance} km` 
                    : ''}
              </p>
            )}
          </div>

          {/* Map Section */}
          {showMap && (
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {selectedLocation ? 'Click on the map to change location' : 'Click on the map to select a location'}
              </h4>
              <div className="h-64 w-full rounded-lg overflow-hidden">
                <Map 
                  center={mapCenter} 
                  zoom={selectedLocation ? 12 : 2} 
                  onClick={handleMapClick}
                  markers={selectedLocation ? [selectedLocation] : []}
                />
              </div>
              {selectedLocation && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Selected Location: </p>
                  <p>Latitude: {selectedLocation.lat.toFixed(4)}</p>
                  <p>Longitude: {selectedLocation.lng.toFixed(4)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {resultsCount} {resultsText} Found
          </h2>

          {resultsCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No {resultsText.toLowerCase()} match your search criteria</p>
            </div>
          ) : searchType === 'teacher' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="relative">
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

