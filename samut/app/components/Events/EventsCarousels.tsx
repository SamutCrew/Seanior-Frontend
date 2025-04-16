'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const EventsCarousel = () => {
  const events = [
    {
      id: 1,
      image: '/Events/1.jpeg',
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
      image: '/Events/3.jpg',
      date: '15 Mar, 2024',
      title: 'Paris Jazz Festival',
      location: 'Champs de Mars, Paris',
      tag: 'Featured Event',
    },
    {
      id: 4,
      image: '/Events/4.jpeg',
      date: '22 Apr, 2024',
      title: 'London Summer Music Gala',
      location: 'Royal Albert Hall, London',
      tag: 'Coming Soon',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [events.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // Adjust speed here (lower = faster progress bar)

    return () => clearInterval(interval);
  }, [autoPlay, nextSlide]);

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden my-12 shadow-xl"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200 z-30">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Slides Container */}
      <div className="relative h-[500px] overflow-hidden">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${events[currentIndex].image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
              <div className="max-w-4xl mx-auto">
                <span className="bg-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 inline-block">
                  {events[currentIndex].tag}
                </span>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    <span className="text-sm">{events[currentIndex].date}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold leading-tight mb-2">
                  {events[currentIndex].title}
                </h2>
                <div className="flex items-center">
                  <span className="text-blue-100">{events[currentIndex].location}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
      >
        <FaChevronLeft className="text-white text-xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
      >
        <FaChevronRight className="text-white text-xl" />
      </button>

      {/* Slider Bar with Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-3/4">
        <div className="flex justify-between items-center h-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCarousel;