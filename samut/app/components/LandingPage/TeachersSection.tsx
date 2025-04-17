"use client"

import { FaChalkboardTeacher } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { SectionTitle } from '../Common/SectionTitle';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { TeacherCard, Teacher } from '../Teachers/TeacherCard';

interface TeachersSectionProps {
  teachers: Teacher[];
}

export const TeachersSection = ({ teachers }: TeachersSectionProps) => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <SectionTitle>Meet Our Expert Instructors</SectionTitle>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          Learn from industry professionals with years of teaching experience and real-world expertise.
        </p>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.5, centeredSlides: true },
          768: { slidesPerView: 2, centeredSlides: false },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className="relative"
      >
        {teachers.map((teacher) => (
          <SwiperSlide key={teacher.id}>
            <div className="px-2 py-4">
              <TeacherCard teacher={teacher} />
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation */}
        <div className="swiper-button-prev hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>

      <div className="text-center mt-12">
        <Link
          href="/teachers"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-sm"
        >
          Browse All Instructors
          <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </section>
  );
};