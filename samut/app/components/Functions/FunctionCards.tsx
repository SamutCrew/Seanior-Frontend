// components/Functions/FunctionCards.tsx
import Link from 'next/link';

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
];

export const FunctionCards = () => {
  return (
    <div className="relative py-16 px-32 bg-blue">
      {/* Top fade - matches sky-100 above to white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-gray-50/50" />
      
      <div className="relative">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">What We Offer</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-center">
          Discover our comprehensive swimming services
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {cards.map((card, index) => (
            <Link href={card.link} key={index} className="group">
              <div className="relative h-80 rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${card.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-white/90">{card.shortDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};