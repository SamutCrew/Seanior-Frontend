interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const SectionTitle = ({ 
  children, 
  className = '', 
  description 
}: SectionTitleProps) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="flex items-center w-full">
        {/* Left Line */}
        <div className="flex-grow h-[3px] bg-gray-400 dark:bg-gray-600"></div>

        {/* Title */}
        <div className="px-6 mx-4 text-3xl font-bold whitespace-nowrap bg-white dark:bg-gray-900">
          {children}
        </div>

        {/* Right Line */}
        <div className="flex-grow h-[3px] bg-gray-400 dark:bg-gray-600"></div>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};
