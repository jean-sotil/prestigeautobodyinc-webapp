// One-time migration: rename status -> publishStatus in blog-posts
// Run with: node --env-file=.env.local scripts/migrate-blog-status.mjs

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Set MONGODB_URI env var');
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db();

  const result = await db
    .collection('blog-posts')
    .updateMany(
      { status: { $exists: true }, publishStatus: { $exists: false } },
      { $rename: { status: 'publishStatus' } },
    );
  console.log(`blog-posts: ${result.modifiedCount} docs migrated`);

  try {
    const vResult = await db
      .collection('_blog-posts_versions')
      .updateMany(
        {
          'version.status': { $exists: true },
          'version.publishStatus': { $exists: false },
        },
        { $rename: { 'version.status': 'version.publishStatus' } },
      );
    console.log(`_blog-posts_versions: ${vResult.modifiedCount} docs migrated`);
  } catch {
    console.log('No versions collection to migrate');
  }

  await client.close();
  console.log('Done');
}

run().catch(console.error);
