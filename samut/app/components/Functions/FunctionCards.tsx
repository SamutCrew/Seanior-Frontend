'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FunctionCard {
  title: string;
  shortDescription: string;
  image: string;
  link: string;
}

const cards: FunctionCard[] = [
  {
    title: 'Find a Swimming Coach',
    shortDescription: 'Connect with certified instructors tailored to your skill level',
    image: '/Feature1.jpg',
    link: '/find-coach',
  },
  {
    title: 'Private Lessons',
    shortDescription: '1-on-1 personalized training with flexible scheduling',
    image: '/Feature2.jpg',
    link: '/private-lessons',
  },
  {
    title: 'Group Classes',
    shortDescription: 'Learn in a fun, social group setting with peers',
    image: '/Feature3.jpg',
    link: '/group-classes',
  },
  {
    title: 'Competitive Training',
    shortDescription: 'Advanced programs for athletes aiming for excellence',
    image: '/Feature4.jpg',
    link: '/competitive-training',
  },
];

const stats = [
  { value: 1200, label: 'Lessons Completed', icon: '🏊‍♂️' },
  { value: 50, label: 'Certified Coaches', icon: '👨‍🏫' },
  { value: 800, label: 'Happy Swimmers', icon: '😊' },
  { value: 15, label: 'Training Locations', icon: '📍' },
];

interface AnimatedNumberProps {
  value: number;
  icon?: string;
}

const AnimatedNumber = ({ value, icon }: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    let start: number | null = null;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(percentage * value);
      setDisplay(current);

      if (percentage < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className="flex items-center justify-center">
      {icon && <span className="text-2xl mr-2">{icon}</span>}
      <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
        {display.toLocaleString()}+
      </p>
    </div>
  );
};

const StatCard = ({ stat }: { stat: typeof stats[0] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
    >
      <AnimatedNumber value={stat.value} icon={stat.icon} />
      <p className="text-gray-600 text-sm md:text-base mt-2 font-medium">
        {stat.label}
      </p>
    </motion.div>
  );
};

const FunctionCard = ({ card, index }: { card: FunctionCard, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-card"
    >
      <Link href={card.link}>
        <div className="relative h-96 md:h-[28rem] rounded-xl shadow-2xl hover:shadow-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 p-name u-url">
          {/* Water effect overlay */}
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10"></div>
          
          {/* Water ripple effect */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-0 group-hover:opacity-30 group-hover:scale-[15] transition-all duration-700"></div>
          </div>
          
          {/* Icon */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-black group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
            </svg>
          </div>
          
          {/* Image with parallax effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 u-photo"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
            <div className="mb-2">
              <div className="w-12 h-1 bg-blue-400 mb-3 group-hover:w-16 transition-all duration-300"></div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 p-name group-hover:text-blue-300 transition-colors duration-300">{card.title}</h3>
              <p className="text-white/90 text-base p-note group-hover:text-white transition-colors duration-300">{card.shortDescription}</p>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-300 opacity-0 group-hover:opacity-100">
              Learn More
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const FunctionCards = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 xl:px-32 bg-gradient-to-b from-blue-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-blue-500 font-medium mb-3">OUR SERVICES</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Dive Into <span className="text-blue-600">Excellence</span>
          </h2>
          <div className="flex items-center justify-center">
            <div className="w-16 h-1 bg-blue-400 mx-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our comprehensive swimming programs designed for all ages and skill levels
            </p>
            <div className="w-16 h-1 bg-blue-400 mx-4"></div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <FunctionCard key={index} card={card} index={index} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Explore All Programs
          </button>
        </motion.div>
      </div>
      
      {/* Water wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-500 opacity-5"></div>
        <svg 
          className="absolute bottom-0 left-0 right-0" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="currentColor" 
            className="text-blue-100" 
            opacity="0.25"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            fill="currentColor" 
            className="text-blue-50" 
            opacity="0.5"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor" 
            className="text-blue-100"
          ></path>
        </svg>
      </div>
    </div>
  );
};