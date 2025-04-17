// pages/index.tsx
import { useRef } from 'react';
import { HeroSection } from '../components/LandingPage/HeroSection';
import { ScrollDownButton } from '../components/LandingPage/ScrollDownButton';
import { SectionTitle } from '../components/Common/SectionTitle';
import { FunctionCards } from '../components/Functions/FunctionCards';

import { TeachersSection } from '../components/LandingPage/TeachersSection';
import { CTASection } from '../components/LandingPage/CTASection';
import  EventCard  from '../components/Events/EventCard';
import EventSection from '../components/LandingPage/EventsSection';

export default function Home() {
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  const teachers = [
    { 
      id: 1, 
      name: 'Michael Phelps', 
      specialty: 'Competitive Swimming', 
      styles: ['Freestyle', 'Butterfly'], 
      levels: ['Intermediate', 'Advanced'], 
      certification: ['ASCA', 'RedCross'], 
      rating: 4.9, 
      experience: 15, 
      image: '/teacher1.jpg', 
      bio: 'Olympic gold medalist specializing in competitive swimming techniques', 
      lessonType: 'Private', 
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
    },
    { 
      id: 2, 
      name: 'Michael Phelps', 
      specialty: 'Competitive Swimming', 
      styles: ['Freestyle', 'Butterfly'], 
      levels: ['Intermediate', 'Advanced'], 
      certification: ['ASCA', 'RedCross'], 
      rating: 4.9, 
      experience: 15, 
      image: '/teacher2.jpg', 
      bio: 'Olympic gold medalist specializing in competitive swimming techniques', 
      lessonType: 'Private', 
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
    },
    { 
      id: 3, 
      name: 'Michael Phelps', 
      specialty: 'Competitive Swimming', 
      styles: ['Freestyle', 'Butterfly'], 
      levels: ['Intermediate', 'Advanced'], 
      certification: ['ASCA', 'RedCross'], 
      rating: 4.9, 
      experience: 15, 
      image: '/teacher3.jpg', 
      bio: 'Olympic gold medalist specializing in competitive swimming techniques', 
      lessonType: 'Private', 
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
    },
    { 
      id: 4, 
      name: 'Michael Phelps', 
      specialty: 'Competitive Swimming', 
      styles: ['Freestyle', 'Butterfly'], 
      levels: ['Intermediate', 'Advanced'], 
      certification: ['ASCA', 'RedCross'], 
      rating: 4.9, 
      experience: 15, 
      image: '/teacher4.jpg', 
      bio: 'Olympic gold medalist specializing in competitive swimming techniques', 
      lessonType: 'Private', 
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' } 
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