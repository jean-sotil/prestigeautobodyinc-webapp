'use client';

import React from 'react';
import Image from 'next/image';

export const Icon: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/logo_symbol.png"
        alt="Prestige"
        width={32}
        height={32}
        style={{ height: 'auto', width: 'auto' }}
      />
    </div>
  );
};
