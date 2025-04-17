"use client"

import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

export interface Location {
    lat: number;
    lng: number;
    address?: string;
  }
  
  export interface Teacher {
    id: number;
    name: string;
    specialty: string;           // Added
    styles: string[];            // Added
    levels: string[];            // Added
    certification: string[];     // Added
    rating: number;
    experience: number;
    image: string;
    bio: string;
    lessonType: string;          // Added
    price: number;               // Added
    location: Location;
  }

interface TeacherCardProps {
  teacher: Teacher;
  userLocation?: Location | null;
}

export const TeacherCard = ({ teacher, userLocation }: TeacherCardProps) => {
  // Calculate distance if user location is provided
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => deg * (Math.PI/180);

  const distance = userLocation 
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        teacher.location.lat,
        teacher.location.lng
      )
    : null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
      {/* Teacher Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={teacher.image}
          alt={teacher.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {/* Experience Badge */}
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {teacher.experience}+ years
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-800">{teacher.name}</h3>
            <p className="text-blue-600 font-medium">{teacher.styles}</p>
          </div>
          {/* Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-700">{teacher.rating}</span>
          </div>
        </div>
        
        {/* Location Information */}
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <div>
            <p className="font-medium">{teacher.location.address || "Location not specified"}</p>
            {distance !== null && (
              <p className="text-xs text-gray-500">
                {Math.round(distance)} km away from you
              </p>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{teacher.bio}</p>
        
        <div className="mt-auto">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};