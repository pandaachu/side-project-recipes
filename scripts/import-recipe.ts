// Import recipes into MongoDB from a JSON file (single object or array).
// Used by the /import-recipe Claude Code command; can also be run by hand.
//
// Usage: npx tsx scripts/import-recipe.ts <path-to-json>
//
// Requires IMPORT_USER_EMAIL in .env / .env.local — recipes are created
// under that user (must already exist, i.e. has signed in at least once).
// Recipes whose refUrl already exists in the database are skipped.
import { config } from 'dotenv';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

import { COOKING_TOOLS } from '../constants/recipe';

config({ path: '.env' });
config({ path: '.env.local' });

const importRecipeSchema = z.object({
  title: z.string().min(1, '缺少標題'),
  coverImage: z.string().url().optional().nullable(),
  forPeople: z.string().default('2'),
  cookingTime: z.number().int().positive().optional().nullable(),
  ingredients: z.array(z.object({ ingredient: z.string(), quantity: z.string().default('') })).default([]),
  steps: z.array(z.string()).default([]),
  tags: z.string().optional().nullable(),
  cookingTools: z.array(z.string()).default([]),
  refUrl: z.string().url('缺少來源網址').optional().nullable(),
  note: z.string().optional().nullable(),
});

const payloadSchema = z.union([importRecipeSchema, z.array(importRecipeSchema)]);

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx scripts/import-recipe.ts <path-to-json>');
    process.exit(1);
  }

  const importUserEmail = process.env.IMPORT_USER_EMAIL;
  if (!importUserEmail) {
    console.error('IMPORT_USER_EMAIL is not set in .env / .env.local');
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Invalid recipe JSON:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }
  const recipes = Array.isArray(parsed.data) ? parsed.data : [parsed.data];

  // Import after dotenv so DATABASE_URL is set before PrismaClient instantiation
  const { default: prisma } = await import('../libs/prismadb');

  const author = await prisma.user.findUnique({ where: { email: importUserEmail } });
  if (!author) {
    console.error(`User not found for IMPORT_USER_EMAIL=${importUserEmail} — sign in on the site once first.`);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    if (recipe.refUrl) {
      const duplicate = await prisma.recipe.findFirst({ where: { refUrl: recipe.refUrl } });
      if (duplicate) {
        console.log(`SKIP (duplicate refUrl): ${recipe.title} — already exists as "${duplicate.title}"`);
        skipped++;
        continue;
      }
    }

    const unknownTools = recipe.cookingTools.filter((tool) => !(COOKING_TOOLS as readonly string[]).includes(tool));
    if (unknownTools.length > 0) {
      console.warn(`WARN: "${recipe.title}" has tools outside COOKING_TOOLS: ${unknownTools.join(', ')}`);
    }

    const data = await prisma.recipe.create({
      data: {
        title: recipe.title,
        coverImage: recipe.coverImage ?? null,
        forPeople: recipe.forPeople,
        cookingTime: recipe.cookingTime ?? null,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        tags: recipe.tags ?? null,
        cookingTools: recipe.cookingTools,
        refUrl: recipe.refUrl ?? null,
        note: recipe.note ?? null,
        status: 'PUBLISHED',
        authorId: author.id,
        authorName: author.name,
        authorImage: author.image,
      },
    });
    console.log(`CREATED: ${data.title} (${data.id})`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, skipped: ${skipped}, total input: ${recipes.length}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
