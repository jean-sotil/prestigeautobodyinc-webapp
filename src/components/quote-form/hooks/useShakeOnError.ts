'use client';

import { useEffect, useRef, useState } from 'react';

export function useShakeOnError(error: string | undefined) {
  const [shaking, setShaking] = useState(false);
  const prev = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (error && error !== prev.current) {
      setShaking(true);
      const id = window.setTimeout(() => setShaking(false), 400);
      prev.current = error;
      return () => window.clearTimeout(id);
    }
    prev.current = error;
  }, [error]);
  return shaking;
}
