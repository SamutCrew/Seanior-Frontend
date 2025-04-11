import Link from 'next/link';
import { FaChalkboardTeacher, FaBook, FaCalendarAlt } from 'react-icons/fa';

interface FunctionCard {
  title: string;
  link: string;
}

interface FunctionCardsProps {
  cards: FunctionCard[];
}

export const FunctionCards = ({ cards }: FunctionCardsProps) => {
  return (
    <section className="mt-4 py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold  text-gray-900 mb-8">
          We design digital products
        </h2>
        <p className="text-gray-600 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8">
          You know your product, your big idea, is known pursuing Windows in
          printing option/installation to Android and Linux...
        </p>
        <br/>
      </div>

      <div className="flex flex-wrap justify-center gap-12 md:gap-20 mt-4">
        {/* Teacher */}
        <Link 
          href="/teachers" 
          className="text-4xl flex flex-col items-center px-8 w-40 hover:bg-blue-50 rounded-xl transition-all duration-300 group "
        >
          <FaChalkboardTeacher className="text-blue-600 text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-gray-800">Teacher</span>
        </Link>

        {/* Course */}
        <Link 
          href="/courses" 
          className="text-4xl flex flex-col items-center px-8 w-40 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
        >
          <FaBook className="text-blue-600 text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-gray-800">Course</span>
        </Link>

        {/* Events */}
        <Link 
          href="/events" 
          className="text-4xl flex flex-col items-center px-8 w-40 hover:bg-blue-50 rounded-xl transition-all duration-300 group"
        >
          <FaCalendarAlt className="text-blue-600 text-5xl mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-gray-800">Events</span>
        </Link>
      </div>
    </section>
  );
};