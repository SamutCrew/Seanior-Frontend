"use client"

import { useState } from 'react';
import { FaSearch, FaChalkboardTeacher, FaStar, FaFilter } from 'react-icons/fa';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  experience: number;
  image: string;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    minRating: 0,
    minExperience: 0
  });

  // Sample teacher data
  const teachers: Teacher[] = [
    { id: 1, name: 'John Smith', subject: 'Mathematics', rating: 4.8, experience: 5, image: '/teacher1.jpg' },
    { id: 2, name: 'Sarah Johnson', subject: 'Physics', rating: 4.5, experience: 3, image: '/teacher2.jpg' },
    { id: 3, name: 'Michael Brown', subject: 'Chemistry', rating: 4.9, experience: 7, image: '/teacher3.jpg' },
    { id: 4, name: 'Emily Davis', subject: 'Biology', rating: 4.7, experience: 4, image: '/teacher4.jpg' },
    { id: 5, name: 'Robert Wilson', subject: 'Mathematics', rating: 4.6, experience: 6, image: '/teacher5.jpg' },
  ];

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (filters.subject === '' || teacher.subject === filters.subject) &&
      teacher.rating >= filters.minRating &&
      teacher.experience >= filters.minExperience;

    return matchesSearch && matchesFilters;
  });

  return (
    
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <br/>
      <br/>
      <br/>
      <div className="max-w-7xl mx-auto mt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Teacher</h1>
          <p className="text-lg text-gray-600">Search from our qualified educators</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or subject..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
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
                className="w-full border border-gray-300 rounded-md p-2"
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Experience</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={filters.minExperience}
                onChange={(e) => setFilters({...filters, minExperience: Number(e.target.value)})}
              >
                <option value="0">Any Experience</option>
                <option value="1">1+ Years</option>
                <option value="3">3+ Years</option>
                <option value="5">5+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {filteredTeachers.length} Teachers Found
          </h2>

          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No teachers match your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaChalkboardTeacher className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{teacher.name}</h3>
                        <p className="text-gray-600">{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{teacher.rating}</span>
                      </div>
                      <div>
                        <span>{teacher.experience} years experience</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
                      View Profile
                    </button>
                  </div>
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