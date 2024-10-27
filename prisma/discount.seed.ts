import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const discounts = [
  {
    code: 'SUMMER2024',
    discountRate: 20.0,
    validFrom: new Date('2024-06-01T00:00:00.000Z'),
    validTo: new Date('2024-08-31T00:00:00.000Z'),
    maxUsage: 100,
  },
  {
    code: 'WINTER2024',
    discountRate: 15.0,
    validFrom: new Date('2024-12-01T00:00:00.000Z'),
    validTo: new Date('2025-02-28T00:00:00.000Z'),
    maxUsage: 50,
  },
  {
    code: 'BLACKFRIDAY',
    discountRate: 30.0,
    validFrom: new Date('2024-11-01T00:00:00.000Z'),
    validTo: new Date('2024-11-30T00:00:00.000Z'),
    maxUsage: 200,
  },
];

const seedDiscount = async (discount) => {
  await prisma.discount.upsert({
    where: { code: discount.code },
    update: {
      discountRate: discount.discountRate,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
      maxUsage: discount.maxUsage,
    },
    create: {
      code: discount.code,
      discountRate: discount.discountRate,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
      maxUsage: discount.maxUsage,
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
