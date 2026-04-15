import config from '@payload-config';
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '../importMap.js';

interface PageProps {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  return RootPage({
    config,
    importMap,
    params,
    searchParams,
  });
}
