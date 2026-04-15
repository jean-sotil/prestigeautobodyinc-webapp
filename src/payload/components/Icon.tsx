'use client';

import React from 'react';

export const Icon: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/prestige-logo.png"
        alt="Prestige"
        style={{ height: '32px', width: 'auto' }}
      />
    </div>
  );
};
