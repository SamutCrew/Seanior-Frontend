// pages/index.tsx
import { useRef } from 'react';
import { HeroSection } from '../components/Hero/HeroSection';
import { ScrollDownButton } from '../components/Hero/ScrollDownButton';
import { SectionTitle } from '../components/Common/SectionTitle';
import { FunctionCards } from '../components/Functions/FunctionCards';

import { TeachersSection } from '../components/Teachers/TeachersSection';
import { CTASection } from '../components/CTA/CTASection';
import  EventCard  from '../components/Events/EventCard';
import EventSection from '../components/Events/EventsSection';

export default function Home() {
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Data
  const events = [
    {
      title: "Siempre Son Flores Live",
      date: "June 15, 2024",
      location: "Buenos Aires, Argentina",
      image: "/images/concert1.jpg"
    },
    {
      title: "Music Festival",
      date: "July 22, 2024",
      location: "Madrid, Spain",
      image: "/images/concert2.jpg"
    },
    {
      title: "Acoustic Sessions",
      date: "August 5, 2024",
      location: "Mexico City, Mexico",
      image: "/images/concert3.jpg"
    }
  ];

  const teachers = [
    {
      id: 1,
      name: "John Doe",
      subject: "Mathematics",
      rating: 4.8,
      experience: 5,
      image: "/path/to/image.jpg",
      bio: "Experienced math teacher with a passion for making complex concepts simple..."
    },
    {
      id: 2,
      name: "John Doe",
      subject: "Mathematics",
      rating: 4.8,
      experience: 5,
      image: "/path/to/image.jpg",
      bio: "Experienced math teacher with a passion for making complex concepts simple..."
    },
    {
      id: 3,
      name: "John Doe",
      subject: "Mathematics",
      rating: 4.8,
      experience: 5,
      image: "/path/to/image.jpg",
      bio: "Experienced math teacher with a passion for making complex concepts simple..."
    }
  ];

  return (
    <div className="">
       <HeroSection
        title="Find Your Swimming Instructor"
        subtitle="Connect with certified instructors for all ages and skill levels"
        imageSrc="/SwimmimgLanding.jpg"
        primaryAction={{
          text: 'Browse Instructors',
          onClick: () => console.log('Find Tour Clicked'),
        }}
        secondaryAction={{
          text: 'How It Works',
          onClick: () => console.log('How it Works Clicked'),
        }}
      />

      {/* Functions Section */}
      <FunctionCards/>

      {/* Events Section */}
      <section ref={nextSectionRef} className="px-4 max-w-6xl mx-auto mt-10">
      <SectionTitle className="my-custom-class" description="Join our community events to learn, network, and grow with industry experts.">
          Event Avilable
        </SectionTitle>
      <EventSection />
      </section>


      {/* Teachers Section */}
      <TeachersSection teachers={teachers} />

      <CTASection
        title="Ready to Dive In?"
        description="Join hundreds of students improving their swimming skills today"
        buttonText="Find Your Instructor"
        onButtonClick={() => console.log("CTA clicked")}
      />
    </div>

    
  );
}