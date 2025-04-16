'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FunctionCard {
  title: string;
  shortDescription: string;
  image: string;
  link: string;
}

const cards: FunctionCard[] = [
  {
    title: 'Find a Swimming Coach',
    shortDescription: 'Connect with certified instructors',
    image: '/Feature1.jpg',
    link: '/find-coach',
  },
  {
    title: 'Private Lessons',
    shortDescription: '1-on-1 personalized training',
    image: '/Feature2.jpg',
    link: '/private-lessons',
  },
  {
    title: 'Group Classes',
    shortDescription: 'Learn in a fun group setting',
    image: '/Feature3.jpg',
    link: '/group-classes',
  },
  {
    title: 'Competitive Training',
    shortDescription: 'Advanced programs for athletes',
    image: '/Feature4.jpg',
    link: '/competitive-training',
  },
];

const stats = [
  { value: 1200, label: 'Lessons Completed' },
  { value: 50, label: 'Certified Coaches' },
  { value: 800, label: 'Happy Swimmers' },
  { value: 15, label: 'Training Locations' },
];

interface AnimatedNumberProps {
  value: string; // e.g., "1,200+"
}

const parseNumber = (str: string) => {
  return parseInt(str.replace(/[^0-9]/g, ''), 10);
};

export const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(0);
  const targetValue = parseNumber(value);
  const duration = 100000; 

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(percentage * targetValue);
      setDisplay(current);

      if (percentage < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetValue]);

  return (
    <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
      {display.toLocaleString()}+
    </p>
  );
};

export const FunctionCards = () => {
  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 xl:px-32">
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <AnimatedNumber value={stat.value.toString()} />
              <p className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center">What We Offer</h2>
        
        <div className="text-gray-600 max-w-2xl mx-auto mb-12 text-center">
  <div className="flex items-center justify-center space-x-3">
    <div className="w-8 h-[3px] bg-black dark:bg-gray-400"></div>
    <span>Discover our comprehensive swimming services</span>
    <div className="w-8 h-[3px] bg-black dark:bg-gray-400"></div>
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <Link href={card.link} key={index} className="group h-card">
              <div className="relative h-96 md:h-[28rem] rounded-xl shadow-3xl hover:shadow-4xl overflow-hidden transition-all duration-500 hover:-translate-y-2 p-name u-url">
                <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 u-photo"
                  style={{ backgroundImage: `url(${card.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 p-name">{card.title}</h3>
                  <p className="text-white/90 text-sm md:text-base p-note">{card.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
