"use client"

import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import TeacherCard from '../components/Teachers/TeacherCard';
import CourseCard from '../components/Course/CourseCard';


interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  experience: number;
  image: string;
  bio: string;
}

interface Course {
  id: number;
  title: string;
  subject: string;
  level: string;
  duration: string;
  instructor: string;
  rating: number;
  students: number;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    minRating: 0,
  });
  const [searchType, setSearchType] = useState<'teacher' | 'course'>('teacher');

  // Teacher data
  const teachers: Teacher[] = [
    { id: 1, name: 'John Smith', subject: 'Mathematics', rating: 4.8, experience: 5, image: '/teacher1.jpg', bio: 'Specialized in Algebra and Calculus with 5 years of teaching experience' },
    { id: 2, name: 'Sarah Johnson', subject: 'Physics', rating: 4.5, experience: 3, image: '/teacher2.jpg', bio: 'Quantum physics expert with research background' },
    { id: 3, name: 'Michael Brown', subject: 'Chemistry', rating: 4.9, experience: 7, image: '/teacher3.jpg', bio: 'Organic chemistry specialist with industry experience' },
    { id: 4, name: 'Emily Davis', subject: 'Biology', rating: 4.7, experience: 4, image: '/teacher4.jpg', bio: 'Molecular biology researcher turned educator' },
    { id: 5, name: 'Robert Wilson', subject: 'Mathematics', rating: 4.6, experience: 6, image: '/teacher5.jpg', bio: 'Geometry and Trigonometry expert' },
  ];

  // Course data
  const courses: Course[] = [
    { id: 1, title: 'Introduction to Calculus', subject: 'Mathematics', level: 'Beginner', duration: '8 weeks', instructor: 'John Smith', rating: 4.7, students: 245 },
    { id: 2, title: 'Quantum Mechanics Basics', subject: 'Physics', level: 'Intermediate', duration: '10 weeks', instructor: 'Sarah Johnson', rating: 4.5, students: 189 },
    { id: 3, title: 'Organic Chemistry Fundamentals', subject: 'Chemistry', level: 'Intermediate', duration: '12 weeks', instructor: 'Michael Brown', rating: 4.8, students: 312 },
    { id: 4, title: 'Cell Biology', subject: 'Biology', level: 'Beginner', duration: '6 weeks', instructor: 'Emily Davis', rating: 4.6, students: 178 },
    { id: 5, title: 'Advanced Algebra', subject: 'Mathematics', level: 'Advanced', duration: '10 weeks', instructor: 'Robert Wilson', rating: 4.9, students: 156 },
  ];

  const filteredTeachers = teachers.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      (t.name.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term)) &&
      (filters.subject === '' || t.subject === filters.subject) &&
      t.rating >= filters.minRating
    );
  });

  const filteredCourses = courses.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.title.toLowerCase().includes(term) || c.subject.toLowerCase().includes(term)) &&
      (filters.subject === '' || c.subject === filters.subject) &&
      c.rating >= filters.minRating
    );
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Educational Resources</h1>
          <p className="text-lg text-gray-600">Search for teachers or courses that match your needs</p>
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
              placeholder={searchType === 'teacher' ? "Search teachers by name or subject..." : "Search courses by title or subject..."}
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
              value={searchTerm ? `${resultsText} matching: ${searchTerm}` : ''}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                value={filters.subject}
                onChange={(e) => setFilters({...filters, subject: e.target.value})}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            {searchType === 'course' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                  onChange={(e) => {}}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            )}
          </div>
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
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;