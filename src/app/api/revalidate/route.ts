import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * ISR Revalidation API Endpoint
 * Triggers revalidation of specified paths for blog posts and listings
 *
 * POST /api/revalidate
 * Body: { secret: string, paths: string[] }
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: { secret?: string; paths?: string[] };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { secret, paths } = body;

    // Verify revalidation secret
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Revalidation not configured' },
        { status: 500 },
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Invalid secret' },
        { status: 401 },
      );
    }

    // Validate paths
    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No paths provided' },
        { status: 400 },
      );
    }

    // Revalidate each path
    const results: { path: string; success: boolean; error?: string }[] = [];
    let allSuccessful = true;

    for (const path of paths) {
      try {
        // Validate path format (prevent path traversal)
        if (!path.startsWith('/') || path.includes('..')) {
          results.push({
            path,
            success: false,
            error: 'Invalid path format',
          });
          allSuccessful = false;
          continue;
        }

        revalidatePath(path);
        results.push({ path, success: true });
      } catch (error) {
        allSuccessful = false;
        results.push({
          path,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Return response
    return NextResponse.json(
      {
        success: allSuccessful,
        revalidated: allSuccessful,
        message: allSuccessful
          ? `Successfully revalidated ${paths.length} path(s)`
          : 'Some paths failed to revalidate',
        paths: results,
      },
      { status: allSuccessful ? 200 : 207 },
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
