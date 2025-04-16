import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const events = [
  {
    image: '/Events/1.jpeg',
    date: '24 Jan, 2024',
    title: 'Siempre Son Flores’ Musica Cubana Salsa Jazz adipi',
    location: 'TK, at Atlas Event, New York',
    tag: 'Upcoming Event',
  },
  {
    image: '/Events/2.jpeg',
    date: '10 Feb, 2024',
    title: 'Tokyo International Jazz Night',
    location: 'Tokyo Dome, Japan',
    tag: 'Upcoming Event',
  },
];

const EventsCarousels = () => {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden my-8">
      {/* Carousel Slide */}
      <div
        className="h-[300px] bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${events[index].image})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

        {/* Bottom Left Content */}
        <div className="absolute bottom-5 left-5 z-20 text-white max-w-md">
          <span className="bg-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
            {events[index].tag}
          </span>
          <div className="flex items-center space-x-2 text-sm mb-1">
            <span className="bg-white text-black px-2 py-0.5 rounded">
              {events[index].date}
            </span>
          </div>
          <h2 className="text-lg font-bold leading-tight">
            {events[index].title}
          </h2>
          <p className="text-sm opacity-80 mt-1">{events[index].location}</p>
        </div>

        {/* Arrows Bottom Center */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2 bg-white p-1 rounded-full shadow">
          <button
            onClick={prevSlide}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsCarousels;
