import React, { useState, useEffect } from 'react';
import { Star, Award, Trophy, Sparkles } from 'lucide-react';

const VERSION = '1.0.3';
const CelebrationAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState('opacity-100');
  useEffect(() => {
    console.log('[CelebrationAnimation v' + VERSION + '] Component mounted');
    
    const fadeTimer = setTimeout(() => {
      setOpacity('opacity-0');
    }, 1200);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
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
    <>
      <style>
        {`
          @keyframes subtleScale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className={`
            rounded-full p-4 
            ${bgColor} 
            ${opacity} 
            transition-opacity duration-200
            animate-[subtleScale_1.5s_ease-in-out_infinite]
          `}
        >
          <Icon 
            size={48} 
            className={textColor}
          />
        </div>
      </div>
    </>
  );
};

export default CelebrationAnimation;