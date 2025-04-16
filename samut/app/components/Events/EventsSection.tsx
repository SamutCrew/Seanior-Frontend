// components/EventSection.jsx
import React from 'react';
import EventCard from './EventCard';
import EventsCarousels from './EventsCarousels';

const EventSection = () => {
  // Event data directly in the component
  const events = [
    {
      id: 1,
      title: 'Tech Conference 2023',
      description: 'Join us for the biggest tech conference of the year with industry leaders and innovators.',
      date: 'Oct 15, 2023',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center, San Francisco',
      category: 'Conference',
      imageUrl: '/images/tech-conference.jpg',
    },
    {
      id: 2,
      title: 'Web Development Workshop',
      description: 'Hands-on workshop covering the latest in web development technologies and best practices.',
      date: 'Nov 5, 2023',
      time: '10:00 AM - 2:00 PM',
      location: 'Online Event',
      category: 'Workshop',
      imageUrl: '/images/web-dev-workshop.jpg',
    },
    {
      id: 3,
      title: 'Startup Networking Mixer',
      description: 'Connect with fellow entrepreneurs and investors in a casual networking environment.',
      date: 'Dec 2, 2023',
      time: '6:00 PM - 9:00 PM',
      location: 'Downtown Lounge, NYC',
      category: 'Networking',
      imageUrl: '/images/startup-mixer.jpg',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
    
      <div className="container mx-auto px-4">
        <div className="container mx-auto px-4 mb-8">
          <EventsCarousels/>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-md font-medium transition-colors duration-300">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventSection;