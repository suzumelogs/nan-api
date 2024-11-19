import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const discounts = [
  {
    id: '1a2b3c4d5e6f7g8h9i0j',
    code: 'SUMMER2024',
    discountRate: 20.0,
    validFrom: new Date('2024-06-01T00:00:00.000Z'),
    validTo: new Date('2024-08-31T00:00:00.000Z'),
    maxUsage: 100,
  },
  {
    id: '1a2b3c4d5e6f7g8h9i1k',
    code: 'WINTER2024',
    discountRate: 15.0,
    validFrom: new Date('2024-12-01T00:00:00.000Z'),
    validTo: new Date('2025-02-28T00:00:00.000Z'),
    maxUsage: 50,
  },
  {
    id: '1a2b3c4d5e6f7g8h9i2l',
    code: 'BLACKFRIDAY',
    discountRate: 30.0,
    validFrom: new Date('2024-11-01T00:00:00.000Z'),
    validTo: new Date('2024-11-30T00:00:00.000Z'),
    maxUsage: 200,
  },
];

const seedDiscount = async (discount: (typeof discounts)[number]) => {
  try {
    await prisma.discount.upsert({
      where: { code: discount.code },
      update: {
        discountRate: discount.discountRate,
        validFrom: discount.validFrom,
        validTo: discount.validTo,
        maxUsage: discount.maxUsage,
      },
      create: {
        id: discount.id,
        code: discount.code,
        discountRate: discount.discountRate,
        validFrom: discount.validFrom,
        validTo: discount.validTo,
        maxUsage: discount.maxUsage,
      },
    });

    console.log(
      `Giảm giá "${discount.code}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật giảm giá "${discount.code}":`,
      error,
    );
  }
};

const seedDiscounts = async () => {
  try {
    console.log('--- Bắt đầu seed giảm giá ---');

    for (const discount of discounts) {
      await seedDiscount(discount);
    }

    console.log('--- Seed giảm giá hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed giảm giá:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedDiscounts();
}

export default seedDiscounts;
