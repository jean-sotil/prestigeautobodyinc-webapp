import { notFound } from 'next/navigation';

export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  await params;
  notFound();
}
