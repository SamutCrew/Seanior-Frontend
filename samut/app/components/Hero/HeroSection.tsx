import Image from 'next/image';
import { Button } from '../Common/Button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  primaryAction: {
    text: string;
    onClick: () => void;
  };
  secondaryAction: {
    text: string;
    onClick: () => void;
  };
}

export const HeroSection = ({
  title,
  subtitle,
  imageSrc,
  primaryAction,
  secondaryAction,
}: HeroSectionProps) => {
  return (
    <div className="relative h-screen">
      <Image 
        src={imageSrc}
        alt="Hero background"
        fill
        className="object-cover opacity-90"
        priority
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary" onClick={primaryAction.onClick}>
            {primaryAction.text}
          </Button>
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.text}
          </Button>
        </div>
      </div>
    </div>
  );
};