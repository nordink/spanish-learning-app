import React, { useEffect, useState } from 'react';
import { Star, Trophy, Sparkles, Award } from 'lucide-react';

const CelebrationAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation duration - matches the CSS animation duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Random celebration type
  const celebrations = [
    {
      Icon: Star,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-200'
    },
    {
      Icon: Award,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-200'
    },
    {
      Icon: Trophy,
      bgColor: 'bg-green-500',
      textColor: 'text-green-200'
    },
    {
      Icon: Sparkles,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-200'
    }
  ];

  const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
  const { Icon, bgColor, textColor } = randomCelebration;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`flex flex-col items-center animate-bounce`}>
        {/* Main celebration icon */}
        <div className={`rounded-full p-4 ${bgColor} animate-pulse`}>
          <Icon 
            size={48} 
            className={`${textColor} animate-spin`}
          />
        </div>
        
        {/* Particle effects */}
        <div className="absolute">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute 
                ${textColor}
                animate-ping
                opacity-75
              `}
              style={{
                left: `${Math.sin(i * 60 * Math.PI / 180) * 50}px`,
                top: `${Math.cos(i * 60 * Math.PI / 180) * 50}px`,
                animation: `ping ${1 + Math.random() * 0.5}s cubic-bezier(0, 0, 0.2, 1) infinite`
              }}
            >
              <Star size={16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CelebrationAnimation;