import React, { useEffect, useState } from 'react';
import { Star, Trophy, Sparkles, Award } from 'lucide-react';

const CelebrationAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  console.log('CelebrationAnimation rendered');

  useEffect(() => {
    console.log('CelebrationAnimation mounted');
    const timer = setTimeout(() => {
      console.log('Animation timeout triggered');
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const celebrations = [
    {
      Icon: Star,
      color: '#ffd700',
      background: '#ffeb3b'
    },
    {
      Icon: Award,
      color: '#e1bee7',
      background: '#9c27b0'
    },
    {
      Icon: Trophy,
      color: '#a5d6a7',
      background: '#4caf50'
    },
    {
      Icon: Sparkles,
      color: '#90caf9',
      background: '#2196f3'
    }
  ];

  const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
  const { Icon, color, background } = randomCelebration;

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'bounce 1s infinite'
      }}>
        <div style={{
          borderRadius: '50%',
          padding: '1rem',
          backgroundColor: background,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          <Icon 
            size={48} 
            color={color}
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
        
        <div style={{ position: 'absolute' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                color: color,
                opacity: 0.75,
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

      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-25%);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(0);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CelebrationAnimation;