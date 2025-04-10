import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { EventCard } from './EventCard';
import { SectionTitle } from '../Common/SectionTitle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface Event {
  title: string;
  date: string;
  location: string;
  image: string;
}

interface EventsSectionProps {
  events: Event[];
}

export const EventsSection = ({ events }: EventsSectionProps) => {
  return (
    <section className="py-16 bg-blue-500 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle>Upcoming Events</SectionTitle>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          navigation
          autoplay={{ 
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          speed={800}
          centeredSlides={false}
          className="pb-8"
        >
          {events.map((event, index) => (
            <SwiperSlide key={index} className="h-auto">
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};