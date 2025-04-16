import { ChevronDown } from 'lucide-react';
import { IconButton } from '../Common/IconButton';

interface ScrollDownButtonProps {
  onClick: () => void;
}

export const ScrollDownButton = ({ onClick }: ScrollDownButtonProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <IconButton 
        icon={<ChevronDown className="text-white" size={24} />} 
        onClick={onClick}
      />
    </div>
  );
};