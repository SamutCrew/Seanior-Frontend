// pages/index.tsx
import { useRef } from 'react';
import { HeroSection } from '../components/Hero/HeroSection';
import { ScrollDownButton } from '../components/Hero/ScrollDownButton';
import { SectionTitle } from '../components/Common/SectionTitle';
import { FunctionCards } from '../components/Functions/FunctionCards';
import { EventsSection } from '../components/Events/EventsSection';
import { TeachersSection } from '../components/Teachers/TeachersSection';
import { CTASection } from '../components/CTA/CTASection';

export default function Home() {
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Data
  const functions = [
    {
      title: "Find a Teacher",
      description: "Certified swimming instructors near you",
      icon: "👨‍🏫",
      link: "/teachers"
    },
    {
      title: "Book a Lesson",
      description: "Private or group swimming lessons",
      icon: "📅",
      link: "/lessons"
    },
    {
      title: "Join Events",
      description: "Competitions and workshops",
      icon: "🏊‍♂️",
      link: "/events"
    }
  ];

  const events = [
    {
      title: "Summer Swim Fest",
      date: "June 15-17, 2024",
      location: "National Aquatic Center",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Youth Championship",
      date: "July 5-7, 2024",
      location: "City Sports Complex",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      title: "Adult Beginners Class",
      date: "June 22, 2024",
      location: "Community Pool",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const teachers = [
    {
      name: "Alex Morgan",
      specialty: "Competitive Swimming",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      name: "Sam Lee",
      specialty: "Children's Lessons",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      name: "Jordan Smith",
      specialty: "Adult Beginners",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Swim with Confidence"
        subtitle="Connect with top-rated swimming instructors and improve your skills"
        imageSrc="/SwimmimgLanding.jpg"
        primaryAction={{
          text: "Find a Teacher",
          onClick: () => console.log("Find teacher clicked")
        }}
        secondaryAction={{
          text: "How It Works",
          onClick: () => console.log("How it works clicked")
        }}
      />
      <ScrollDownButton onClick={scrollToNextSection} />

      {/* Functions Section */}
      <section ref={nextSectionRef} className="py-16 px-4 max-w-6xl mx-auto">
        <SectionTitle>Get Started</SectionTitle>
        <FunctionCards cards={functions} />
      </section>

      {/* Events Section */}
      <EventsSection events={events} />

      {/* Teachers Section */}
      <TeachersSection teachers={teachers} />
      
      {/* CTA Section */}
      <CTASection
        title="Ready to Dive In?"
        description="Join hundreds of students improving their swimming skills today"
        buttonText="Find Your Instructor"
        onButtonClick={() => console.log("CTA clicked")}
      />
    </div>
  );
}