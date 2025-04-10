import Link from 'next/link';

interface FunctionCard {
  title: string;
  description: string;
  icon: string;
  link: string;
}

interface FunctionCardsProps {
  cards: FunctionCard[];
}

export const FunctionCards = ({ cards }: FunctionCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((func, index) => (
        <Link 
          key={index}
          href={func.link}
          className="p-6 border rounded-lg hover:shadow-md transition text-center"
        >
          <span className="text-4xl mb-4 block">{func.icon}</span>
          <h3 className="text-xl font-semibold mb-2">{func.title}</h3>
          <p className="text-gray-600">{func.description}</p>
        </Link>
      ))}
    </div>
  );
};