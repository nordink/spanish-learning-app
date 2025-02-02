import React from 'react';

const CelebrationAnimation = ({ onComplete }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontSize: '24px'
      }}>
        CELEBRATION TEST
      </div>
    </div>
  );
};

export default CelebrationAnimation;