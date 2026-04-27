'use client';

import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/logo_symbol.png"
        alt="Prestige Auto Body Inc"
        style={{ height: 'auto', width: 'auto' }}
      />
      <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a365d' }}>
        Prestige Auto Body
      </span>
    </div>
  );
};
