import config from '@payload-config';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import React from 'react';

import { importMap } from './admin/importMap.js';

import '@payloadcms/next/css';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return RootLayout({
    config,
    children,
    importMap,
    serverFunction: async function serverFunction(args: {
      name: string;
      args: Record<string, unknown>;
    }) {
      'use server';
      return handleServerFunctions({
        ...args,
        config,
        importMap,
      });
    },
  });
}
