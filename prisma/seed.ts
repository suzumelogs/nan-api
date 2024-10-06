import { PrismaClient } from '@prisma/client';
import userSeed from './user.seed';
import discountSeed from './discount.seed';

const prisma = new PrismaClient();

async function main() {
  await userSeed();
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
