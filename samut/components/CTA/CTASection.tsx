import { Button } from '../Common/Button';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const CTASection = ({
  title,
  description,
  buttonText,
  onButtonClick,
}: CTASectionProps) => {
  return (
    <section className="py-16 bg-blue-500 text-white">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="mb-8 text-lg">{description}</p>
        <Button variant="secondary" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </section>
  );
};