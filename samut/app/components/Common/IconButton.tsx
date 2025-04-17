interface IconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }
  
  export const IconButton = ({ icon, onClick, className = '' }: IconButtonProps) => {
    return (
      <button
        onClick={onClick}
        className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition ${className}`}
      >
        {icon}
      </button>
    );
  };