"use client"

import { FaChalkboardTeacher, FaStar } from 'react-icons/fa';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  experience: number;
  image: string;
  bio: string;
}

const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
        <p className="text-sm text-gray-500 mb-4">{teacher.bio}</p>
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
  );
};

export default TeacherCard;