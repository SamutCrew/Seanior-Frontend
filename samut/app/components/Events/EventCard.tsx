import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../Common/Button';

interface EventCardProps {
  event: {
    title: string;
    date: string;
    location: string;
    image: string;
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="h-48 relative">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          {event.date}
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          {event.location}
        </div>
        <Button className="w-full">
          Learn More
        </Button>
      </div>
    </div>
  );
};