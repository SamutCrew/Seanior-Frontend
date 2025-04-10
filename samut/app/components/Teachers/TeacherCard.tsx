import Image from 'next/image';
import { Star } from 'lucide-react';

interface TeacherCardProps {
  teacher: {
    name: string;
    specialty: string;
    rating: string;
    image: string;
  };
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="h-64 relative">
        <Image
          src={teacher.image}
          alt={teacher.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{teacher.name}</h3>
        <p className="text-gray-600 mb-2">{teacher.specialty}</p>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span>{teacher.rating}</span>
        </div>
      </div>
    </div>
  );
};