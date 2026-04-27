'use client';

import { useEffect } from 'react';
import { usePageTitle } from '@/components/BreadcrumbContext';

export default function BreadcrumbTitleSetter({ title }: { title: string }) {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title, setPageTitle]);

  return null;
}
