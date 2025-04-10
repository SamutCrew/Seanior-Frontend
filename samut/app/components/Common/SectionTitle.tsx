interface SectionTitleProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export const SectionTitle = ({ children, className = '' }: SectionTitleProps) => {
    return (
      <h2 className={`text-3xl font-bold text-center mb-8 ${className}`}>
        {children}
      </h2>
    );
  };