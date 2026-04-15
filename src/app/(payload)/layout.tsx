import config from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

import { importMap } from './admin/[[...segments]]/importMap.js';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return RootLayout({
    config,
    children,
    importMap,
    serverFunction: async () => {
      'use server';
      return {};
    },
  });
}
