"use client"

import { FaBook, FaChalkboardTeacher, FaClock, FaStar, FaUserGraduate } from 'react-icons/fa';

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

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaBook className="text-green-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{course.title}</h3>
            <p className="text-gray-600">{course.subject} • {course.level}</p>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <FaChalkboardTeacher className="mr-2" />
            <span>Instructor: {course.instructor}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2" />
            <span>Duration: {course.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaUserGraduate className="mr-2" />
            <span>Students: {course.students}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{course.rating}</span>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;