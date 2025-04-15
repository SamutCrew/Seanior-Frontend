'use client';

import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTwitter, FaChalkboardTeacher, FaSwimmer, FaWater } from 'react-icons/fa';
import { Button } from '../Common/Button';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  primaryAction: {
    text: string;
    onClick: () => void;
  };
  secondaryAction: {
    text: string;
    onClick: () => void;
  };
}

export const HeroSection = ({
  title,
  subtitle,
  imageSrc,
  primaryAction,
  secondaryAction,
}: HeroSectionProps) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Container - made taller */}
      <div className="relative h-[130vh]">
  <Image
    src={imageSrc}
    alt="Hero background"
    fill
    className="object-cover opacity-90"
    priority
  />

  {/* Gradients */}
  <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent" />
  <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/40 to-transparent" />
</div>

      {/* Content Container - positioned absolutely within the parent */}
      <div className="absolute inset-0 h-screen flex flex-col">
        {/* Left social icons - centered vertically */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 text-white text-2xl">
          <motion.a 
            href="#" 
            whileHover={{ y: -3 }}
            className="hover:text-blue-400 transition-colors"
          >
            <FaFacebook />
          </motion.a>
          <motion.a 
            href="#" 
            whileHover={{ y: -3 }}
            className="hover:text-pink-500 transition-colors"
          >
            <FaInstagram />
          </motion.a>
          <motion.a 
            href="#" 
            whileHover={{ y: -3 }}
            className="hover:text-blue-300 transition-colors"
          >
            <FaTwitter />
          </motion.a>
        </div>

        {/* Centered hero text - moved down with pt-32 */}
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center max-w-4xl px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90 mb-8 max-w-2xl drop-shadow-sm mx-auto"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="secondary" onClick={primaryAction.onClick}>
                {primaryAction.text}
              </Button>
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.text}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Cards at bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              title: 'Find Instructors',
              description: 'Certified swimming instructors near you',
              icon: <FaChalkboardTeacher className="text-xl" />,
            },
            {
              title: 'All Levels',
              description: 'From beginners to advanced swimmers',
              icon: <FaSwimmer className="text-xl" />,
            },
            {
              title: 'Pool Locations',
              description: 'Find lessons at convenient locations',
              icon: <FaWater className="text-xl" />,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, opacity: 1 }}
              className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 text-white"
            >
              <div className="p-2 rounded-full bg-white/10">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-white/80">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};