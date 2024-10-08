import { PrismaClient } from '@prisma/client';
import userSeed from './user.seed';
import discountSeed from './discount.seed';
import categorySeed from './category.seed';

const prisma = new PrismaClient();

async function main() {
  await userSeed();
  await categorySeed();
  await discountSeed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
