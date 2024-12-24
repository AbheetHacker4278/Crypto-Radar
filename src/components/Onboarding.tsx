import React from 'react';
import { X } from 'lucide-react';

const steps = [
  {
    title: 'Welcome to CryptoTrack!',
    description: 'Track your favorite cryptocurrencies in real-time.',
  },
  {
    title: 'Bookmark Assets',
    description: 'Click the star icon to add assets to your watchlist.',
  },
  {
    title: 'Detailed Analysis',
    description: 'Click any asset to view detailed charts and information.',
  },
];

export const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(() => {
    return !localStorage.getItem('onboardingComplete');
  });

  const handleComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black p-8 max-w-md mx-4 relative animate-fade-in">
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 hover:bg-gray-100 p-2"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 py-2 border-2 border-black hover:bg-gray-100"
            >
              Previous
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-6 py-2 border-2 border-black bg-green-300 hover:bg-green-400"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 border-2 border-black bg-green-300 hover:bg-green-400"
            >
              Get Started
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-6 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-green-300' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};