import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const discounts = [
  {
    code: 'SUMMER2024',
    discountPercentage: 20.0,
    startTime: new Date('2024-06-01T00:00:00.000Z'),
    endTime: new Date('2024-08-31T00:00:00.000Z'),
    maxUses: 100,
  },
  {
    code: 'WINTER2024',
    discountPercentage: 15.0,
    startTime: new Date('2024-12-01T00:00:00.000Z'),
    endTime: new Date('2025-02-28T00:00:00.000Z'),
    maxUses: 50,
  },
  {
    code: 'BLACKFRIDAY',
    discountPercentage: 30.0,
    startTime: new Date('2024-11-01T00:00:00.000Z'),
    endTime: new Date('2024-11-30T00:00:00.000Z'),
    maxUses: 200,
  },
];

const seedDiscount = async (discount: (typeof discounts)[number]) => {
  await prisma.discount.upsert({
    where: { code: discount.code },
    update: {
      discountPercentage: discount.discountPercentage,
      startTime: discount.startTime,
      endTime: discount.endTime,
      maxUses: discount.maxUses,
    },
    create: {
      code: discount.code,
      discountPercentage: discount.discountPercentage,
      startTime: discount.startTime,
      endTime: discount.endTime,
      maxUses: discount.maxUses,
    },
  });

  console.log(`Discount ${discount.code} seeded successfully.`);
};

const discountSeed = async () => {
  try {
    for (const discount of discounts) {
      await seedDiscount(discount);
    }
  } catch (error) {
    console.error('Error seeding discounts: ', error);
  } finally {
    await prisma.$disconnect();
  }
};

export default discountSeed;
