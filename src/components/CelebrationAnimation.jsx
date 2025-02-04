import React, { useEffect, useState } from 'react';
import { Star, Trophy, Sparkles, Award } from 'lucide-react';

const CelebrationAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 800); // Reduced duration
    return () => clearTimeout(timer);
  }, [onComplete]);

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
      <div className={`rounded-full p-4 ${bgColor} animate-bounce`}>
        <Icon 
          size={48} 
          className={textColor}
        />
      </div>
    </div>
  );
};

export default CelebrationAnimation;