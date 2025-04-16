'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

// EventCard.tsx
type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl: string;
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group px-4"
    >
      {/* Image with gradient overlay */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {event.category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Date and Time */}
        <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-2">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <FaCalendarAlt className="w-3 h-3 mr-2 text-blue-600" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
            <FaClock className="w-3 h-3 mr-2 text-blue-600" />
            <span>{event.time}</span>
          </div>
        </div>
        
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{event.title}</h3>
        <p className="text-gray-600 mb-5 line-clamp-2">{event.description}</p>
        
        {/* Location and Button */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-600">{event.location}</span>
          </div>
          <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300">
            Register <FaArrowRight className="ml-2 w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// EventsCarousels.tsx
const carouselEvents = [
  {
    id: 1,
    image: '/Events/Event6.jpg',
    date: '24 Jan, 2024',
    title: 'Siempre Son Flores Musica Cubana Salsa Jazz',
    location: 'TK, at Atlas Event, New York',
    tag: 'Featured Event',
  },
  {
    id: 2,
    image: '/Events/Event7.jpg',
    date: '10 Feb, 2024',
    title: 'Tokyo International Jazz Night',
    location: 'Tokyo Dome, Japan',
    tag: 'Upcoming Event',
  },
  {
    id: 3,
    image: '/Events/Event8.jpg',
    date: '15 Mar, 2024',
    title: 'Paris Jazz Festival',
    location: 'Champs de Mars, Paris',
    tag: 'Featured Event',
  },
];

const EventsCarousels = () => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? carouselEvents.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === carouselEvents.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden my-12 shadow-xl"
    >
      {/* Carousel Slide */}
      <div
        className="h-[400px] bg-cover bg-center transition-all duration-500 relative"
        style={{ backgroundImage: `url(${carouselEvents[index].image})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        
        {/* Water ripple effect */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-0 group-hover:opacity-30 group-hover:scale-[15] transition-all duration-700"></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
          <div className="max-w-4xl ">
            <span className="bg-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 inline-block">
              {carouselEvents[index].tag}
            </span>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <FaCalendarAlt className="w-4 h-4 mr-2" />
                <span className="text-sm">{carouselEvents[index].date}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-2">
              {carouselEvents[index].title}
            </h2>
            <div className="flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-300" />
              <span className="text-blue-100">{carouselEvents[index].location}</span>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-3">
          <button
            onClick={prevSlide}
            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
          >
            <FaChevronLeft className="text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
          >
            <FaChevronRight className="text-white" />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2">
          {carouselEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// EventSection.tsx
const EventSection = () => {
  const events = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year with industry leaders and innovators sharing cutting-edge technologies.',
      date: 'Oct 15, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Convention Center, San Francisco',
      category: 'Conference',
      imageUrl: '/Events/1.jpeg',
    },
    {
      id: 2,
      title: 'Web Development Masterclass',
      description: 'Hands-on workshop covering the latest in web development technologies, frameworks, and best practices for modern applications.',
      date: 'Nov 5, 2024',
      time: '10:00 AM - 2:00 PM',
      location: 'Online Event',
      category: 'Workshop',
      imageUrl: '/Events/2.jpg',
    },
    {
      id: 3,
      title: 'Startup Networking Mixer',
      description: 'Connect with fellow entrepreneurs, investors, and tech enthusiasts in a vibrant networking environment with drinks and appetizers.',
      date: 'Dec 2, 2024',
      time: '6:00 PM - 9:00 PM',
      location: 'Downtown Lounge, NYC',
      category: 'Networking',
      imageUrl: '/Events/3.jpeg',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-32 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue-600 font-medium mb-4 tracking-wider">UPCOMING EVENTS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Our <span className="text-blue-600">Exciting Events</span>
          </h2>
          <div className="flex items-center justify-center">
            <div className="w-16 h-1 bg-blue-400 mx-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join our community for unforgettable experiences and networking opportunities
            </p>
            <div className="w-16 h-1 bg-blue-400 mx-4"></div>
          </div>
        </motion.div>

        {/* Featured Carousel */}
        <EventsCarousels />

        {/* Event Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center mx-auto">
            View All Events
            <FaArrowRight className="ml-3 w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg 
          className="absolute bottom-0 left-0 right-0" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            className="text-blue-50" 
            opacity="0.25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            className="text-blue-100" 
            opacity="0.5"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor" 
            className="text-blue-100"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default EventSection;