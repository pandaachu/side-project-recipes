// One-off migration: Recipe.cookingTool (legacy string) -> cookingTools (string[]).
// Idempotent — only touches documents that still carry the legacy field.
// Back up your MongoDB Atlas data before running.
// Usage: npx tsx scripts/migrate-cooking-tools.ts
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

async function main() {
  // Import after dotenv so DATABASE_URL is set before PrismaClient instantiation
  const { default: prisma } = await import('../libs/prismadb');

  // Move legacy string values into the new array field, then drop the old field
  const migrated = (await prisma.$runCommandRaw({
    update: 'Recipe',
    updates: [
      {
        q: { cookingTool: { $type: 'string' } },
        u: [
          {
            $set: {
              cookingTools: {
                $cond: [{ $gt: [{ $strLenCP: '$cookingTool' }, 0] }, ['$cookingTool'], []],
              },
            },
          },
          { $unset: 'cookingTool' },
        ],
        multi: true,
      },
    ],
  })) as { n?: number; nModified?: number };

  console.log(`Migrated cookingTool -> cookingTools: ${migrated.nModified ?? 0} of ${migrated.n ?? 0} matched`);

  // Backfill so every document has the new field
  const backfilled = (await prisma.$runCommandRaw({
    update: 'Recipe',
    updates: [
      {
        q: { cookingTools: { $exists: false } },
        u: { $set: { cookingTools: [] } },
        multi: true,
      },
    ],
  })) as { n?: number; nModified?: number };

  console.log(`Backfilled empty cookingTools: ${backfilled.nModified ?? 0}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
