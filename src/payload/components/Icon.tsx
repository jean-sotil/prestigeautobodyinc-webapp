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
        src="/logo_symbol.png"
        alt="Prestige"
        style={{ height: 'auto', width: 'auto' }}
      />
    </div>
  );
};
