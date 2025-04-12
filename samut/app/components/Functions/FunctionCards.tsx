import Link from 'next/link';
import {
  FaChessKing,
  FaPiggyBank,
  FaWallet,
  FaIndustry,
  FaQuestionCircle,
  FaChartLine,
} from 'react-icons/fa';

interface FunctionCard {
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: JSX.Element;
  link: string;
}

const cards: FunctionCard[] = [
  {
    title: 'Financial Planning',
    shortDescription: 'Strategize your finances effectively.',
    longDescription: 'Strategize your finances effectively for short-term and long-term goals',
    icon: <FaChessKing />,
    link: '/financial-planning',
  },
  {
    title: 'Saving & Investments',
    shortDescription: 'Start saving smartly.',
    longDescription: 'Start saving smartly and investing wisely with options that suit your financial plans and growth objectives.',
    icon: <FaPiggyBank />,
    link: '/saving-investments',
  },
  {
    title: 'Investment Planning',
    shortDescription: 'Diversify your investments.',
    longDescription: 'Plan and diversify your investments for consistent growth, future readiness, and risk management.',
    icon: <FaChartLine />,
    link: '/investment-planning',
  },
  {
    title: 'Mutual Funds',
    shortDescription: 'Explore diversified portfolios.',
    longDescription: 'Explore diversified portfolios and professionally managed',
    icon: <FaWallet />,
    link: '/mutual-funds',
  },
  {
    title: 'Industrial Insurance',
    shortDescription: 'Coverage for industrial operations.',
    longDescription: 'Get robust coverage options for industrial operations, machinery, and liabilities with custom plans.',
    icon: <FaIndustry />,
    link: '/industrial-insurance',
  },
  {
    title: 'Dispute Support',
    shortDescription: 'Get professional help.',
    longDescription: 'Receive legal and professional help to resolve financial or business disputes efficiently and effectively.',
    icon: <FaQuestionCircle />,
    link: '/dispute-support',
  },
];

export const FunctionCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center ">
      <h2 className="text-6xl md:text-5xl font-bold text-gray-900 mb-4">What We Offer</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">
        We provide services tailored to your financial success and business needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="relative group p-4 rounded-xl shadow-md bg-white hover:bg-blue-600 text-gray-900 hover:text-white transition-all duration-300 overflow-hidden min-h-[275px] flex flex-col items-center justify-center text-center"
          >
            {/* Icon - disappears on hover */}
            <div className="text-5xl mb-4 text-blue-600 group-hover:opacity-0 group-hover:h-0 transition-all duration-300">
              {card.icon}
            </div>
          
            {/* Content container that moves up on hover */}
            <div className="group-hover:-translate-y-8 transition-all duration-300">
              {/* Title - gets larger on hover */}
              <h3 className="text-xl group-hover:text-2xl font-semibold mb-2 transition-all duration-300">
                {card.title}
              </h3>
            
              {/* Description wrapper */}
              <div className="relative h-[72px] w-full flex items-center justify-center">
                {/* Short description - default view */}
                <p className="absolute text-sm text-gray-600 group-hover:opacity-0 transition-opacity duration-300">
                  {card.shortDescription}
                </p>
            
                {/* Long description - appears on hover */}
                <p className="absolute text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white px-1">
                  {card.longDescription}
                </p>
              </div>
            </div>
          
            {/* Button - appears on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 absolute bottom-6 flex justify-center">
              <Link
                href={card.link}
                className="inline-flex items-center bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-gray-100 transition"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};