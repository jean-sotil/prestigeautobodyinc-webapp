import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';

export interface GalleryImage {
  /** Public URL, e.g. `/gallery/album-slug/file.jpg` */
  src: string;
  /** Bare filename, e.g. `file.jpg` */
  filename: string;
}

export interface GalleryAlbum {
  /** Folder name under `public/gallery/`, used as i18n key and route slug */
  slug: string;
  images: GalleryImage[];
}

const GALLERY_ROOT = path.join(process.cwd(), 'public', 'gallery');
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|avif)$/i;

async function readAlbumImages(slug: string): Promise<GalleryImage[]> {
  const dir = path.join(GALLERY_ROOT, slug);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  return entries
    .filter((name) => IMAGE_EXT_RE.test(name) && !name.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((filename) => ({
      filename,
      src: `/gallery/${slug}/${filename}`,
    }));
}

async function readAllAlbums(): Promise<GalleryAlbum[]> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(GALLERY_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }
  const albumSlugs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();

  const albums = await Promise.all(
    albumSlugs.map(async (slug) => ({
      slug,
      images: await readAlbumImages(slug),
    })),
  );
  return albums.filter((album) => album.images.length > 0);
}

/** Cached per-request read of every gallery album from `public/gallery/`. */
export const getGalleryAlbums = cache(readAllAlbums);
