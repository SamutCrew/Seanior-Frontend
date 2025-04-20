"use client"

import { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaTimes, FaCheck, FaUsers, FaStar, FaDollarSign } from 'react-icons/fa';
import CourseCard from '@/app/components/Course/CourseCard';
import CourseForm from '@/app/components/Course/CourseForm';

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
  location: {
    address: string;
  };
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([
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
        address: 'Skyline Aquatic Center, Pool 2'
      }
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleAddCourse = (newCourseData: any) => {
    const newCourse: Course = {
      id: Math.max(...courses.map(c => c.id), 0) + 1,
      ...newCourseData,
      instructor: 'Alex Johnson',
      rating: 4.5,
      students: 0
    };
    setCourses([...courses, newCourse]);
    setIsCreateModalOpen(false);
  };

  const handleEditCourse = (editedCourseData: any) => {
    setCourses(courses.map(course => 
      course.id === currentCourse?.id ? { ...course, ...editedCourseData } : course
    ));
    setIsEditModalOpen(false);
  };

  const handleDeleteCourse = () => {
    if (currentCourse) {
      setCourses(courses.filter(course => course.id !== currentCourse.id));
      setIsDeleteModalOpen(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.focus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    return matchesSearch && matchesLevel;
  });

  // Calculate stats for the create course modal
  const courseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    avgRating: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1),
    totalRevenue: courses.reduce((sum, course) => sum + (course.price * course.students), 0)
  };

  return (
    <div className="min-h-screen bg-sky-50 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-800">My Courses</h1>
            <p className="text-gray-600">Manage your swimming courses and students</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
          >
            <FaPlus /> New Course
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-white w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="bg-white border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border transition-colors duration-200">
                <FaFilter /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg">
              <CourseCard course={course} />
              <div className="p-4 border-t">
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setCurrentCourse(course);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentCourse(course);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Course Button (always visible) */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <FaPlus /> Create Course
          </button>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center transition-all duration-300">
            <div className="max-w-md mx-auto">
              <div className="text-5xl mb-4 text-gray-300">🏊‍♂️</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {courses.length === 0 ? 'No courses yet' : 'No matching courses'}
              </h3>
              <p className="text-gray-500 mb-6">
                {courses.length === 0 
                  ? 'Create your first swimming course to get started' 
                  : 'Try adjusting your search filters'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200"
              >
                <FaPlus /> Create Course
              </button>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {filteredCourses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
            <h3 className="font-medium text-gray-700 mb-4">Course Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-sky-50 p-4 rounded-lg flex items-center gap-3 hover:shadow-sm transition-all duration-200">
                <div className="bg-sky-100 p-3 rounded-full">
                  <FaPlus className="text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-sky-600">Total Courses</p>
                  <p className="text-xl font-bold">{filteredCourses.length}</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 hover:shadow-sm transition-all duration-200">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaUsers className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Active Students</p>
                  <p className="text-xl font-bold">{filteredCourses.reduce((sum, course) => sum + course.students, 0)}</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-3 hover:shadow-sm transition-all duration-200">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaStar className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600">Avg Rating</p>
                  <p className="text-xl font-bold">
                    {(filteredCourses.reduce((sum, course) => sum + course.rating, 0) / filteredCourses.length).toFixed(1)}
                  </p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3 hover:shadow-sm transition-all duration-200">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaDollarSign className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Total Revenue</p>
                  <p className="text-xl font-bold">
                    ${filteredCourses.reduce((sum, course) => sum + (course.price * course.students), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Course Modal with Stats */}
        {isCreateModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ease-out z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className={`
                bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
                transform transition-all duration-300 ease-out
                ${isCreateModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
              `}>
                <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-bold text-sky-800">Create New Course</h2>
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="p-6">
                  {/* Stats in Create Modal */}
                  <div className="bg-sky-50 rounded-lg p-4 mb-6 transition-all duration-200">
                    <h3 className="font-medium text-sky-700 mb-3">Your Current Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg hover:shadow-sm transition-all duration-200">
                        <p className="text-sm text-gray-500">Total Courses</p>
                        <p className="text-lg font-bold">{courseStats.totalCourses}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg hover:shadow-sm transition-all duration-200">
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-lg font-bold">{courseStats.totalStudents}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg hover:shadow-sm transition-all duration-200">
                        <p className="text-sm text-gray-500">Avg Rating</p>
                        <p className="text-lg font-bold">{courseStats.avgRating}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg hover:shadow-sm transition-all duration-200">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-lg font-bold">${courseStats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CourseForm 
                    onSubmit={handleAddCourse}
                    onCancel={() => setIsCreateModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Course Modal */}
        {isEditModalOpen && currentCourse && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ease-out z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className={`
                bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
                transform transition-all duration-300 ease-out
                ${isEditModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
              `}>
                <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-bold text-sky-800">Edit Course</h2>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <CourseForm 
                    initialData={currentCourse}
                    onSubmit={handleEditCourse}
                    onCancel={() => setIsEditModalOpen(false)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && currentCourse && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ease-out z-50"></div>
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              <div className={`
                bg-white rounded-lg shadow-xl w-full max-w-md
                transform transition-all duration-300 ease-out
                ${isDeleteModalOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
              `}>
                <div className="flex justify-between items-center border-b p-4">
                  <h2 className="text-xl font-bold text-sky-800">Confirm Deletion</h2>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="mb-6">Are you sure you want to delete <strong>{currentCourse.title}</strong>? This action cannot be undone.</p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteCourse}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                      <FaCheck /> Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}