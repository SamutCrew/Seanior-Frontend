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
      <h2 className="text-3xl font-bold">
        {children}
      </h2>
      {description && (
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};