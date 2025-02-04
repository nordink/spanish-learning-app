import React, { useEffect } from 'react';

const CelebrationAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        color: '#28a745',
        fontSize: '72px',
        animation: 'scale-up 0.5s ease-in-out'
      }}>
        ✓
      </div>
      <style>
        {`
          @keyframes scale-up {
            0% { transform: scale(0.1); opacity: 0; }
            70% { transform: scale(1.2); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default CelebrationAnimation;