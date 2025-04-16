import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { SectionTitle } from '../Common/SectionTitle';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import TeacherCard from './TeacherCard';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  experience: number;
  image: string;
  bio: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
}

export const TeachersSection = ({ teachers }: TeachersSectionProps) => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <SectionTitle>Featured Instructors</SectionTitle>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        className="pb-8"
      >
        {teachers.map((teacher) => (
          <SwiperSlide key={teacher.id}>
            <div className="max-w-sm mx-auto">
              <TeacherCard teacher={teacher} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="text-center mt-8">
        <Link
          href="/teachers"
          className="inline-flex items-center text-blue-500 font-medium"
        >
          View all instructors <ArrowRight className="ml-2" size={18} />
        </Link>
      </div>
    </section>
  );
};