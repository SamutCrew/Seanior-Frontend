interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    onClick?: () => void;
  }
  
  export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-medium transition';
    
    const variantClasses = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-white text-blue-500 hover:bg-gray-100',
      outline: 'border border-white text-white hover:bg-white/10',
    };
    
    return (
      <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };