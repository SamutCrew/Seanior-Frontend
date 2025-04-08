import { useRef } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import CarouselEvent from '../components/CarouselEvents';

export default function Home() {
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  
  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      const targetY = nextSectionRef.current.offsetTop;
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime: number | null = null;
  
      const duration = 1500; // Increase duration (in ms) for a slower effect
  
      const animateScroll = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
  
        window.scrollTo(0, startY + distance * easeOutQuad(progress));
  
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
  
      const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
  
      requestAnimationFrame(animateScroll);
    }
  };
  
  const slides = [
    {
      title: "Event Available Now",
      description: "Join us for an exclusive event featuring insightful sessions and networking opportunities.",
      buttonText: "Learn More"
    },
    {
      title: "Summer Swim Fest",
      description: "Splash into summer fun with our exciting swim events, games, and prizes!",
      buttonText: "Join Now"
    },
    {
      title: "Advanced Training",
      description: "Upgrade your skills with our professional-level swimming bootcamp.",
      buttonText: "Register Today"
    },
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Hero Section */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/SwimmimgLanding.jpg" 
          alt="Underwater swimmer" 
          layout="fill" 
          objectFit="cover" 
          objectPosition="center"
          className="opacity-90"
        />
      </div>

      {/* Content should be on top of the image */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-12 mx-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          Dive into a <br/>
          <span className="text-blue-300">World of Swimming Excellence!</span>
        </h1>
        <p className="mt-2 text-lg md:text-xl text-gray-200 px-12 mx-12 pt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="bg-white text-black px-6 py-3 rounded-full shadow-lg">▶ Watch Video</button>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg">Learn more →</button>
        </div>
      </div>

      {/* Wave Divider */}
  


      {/* Scroll Down Button */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <button
          onClick={scrollToNextSection}
          className="absolute left-1/2 transform -translate-x-1/2 -top-6 bg-white-500  p-3 rounded-full shadow-md  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-400"
        >
          <ChevronDown className="text-white w-6 h-6 " />
        </button>
      </div>

      
      {/* Event Section */}
      <section ref={nextSectionRef} className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white w-screen">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="w-full h-24 sm:h-32 lg:h-48" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              d="M0,128L60,112C120,96,240,64,360,85.3C480,107,600,181,720,197.3C840,213,960,171,1080,149.3C1200,128,1320,128,1380,128L1440,128V0H1380C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0H0Z"
            ></path>
          </svg>
        </div>

        {/* Event Content */}
        <div className="relative z-10 text-center w-full max-w-4xl px-6">
        <CarouselEvent></CarouselEvent>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="w-full h-24 sm:h-32 lg:h-48" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              d="M0,160L60,165.3C120,171,240,181,360,197.3C480,213,600,235,720,234.7C840,235,960,213,1080,186.7C1200,160,1320,128,1380,112L1440,96V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
            ></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
