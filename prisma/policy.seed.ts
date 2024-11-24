import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const policies = [
  {
    id: '64ab1c2d3d9f450000a12345',
    description: 'Chính sách tiêu chuẩn: yêu cầu đặt cọc 10% giá trị sản phẩm.',
    depositRate: 0.1,
    damageProcessingFee: 100000,
  },
  {
    id: '64ab1c2d3d9f450000a12347',
    description:
      'Chính sách tiết kiệm: đặt cọc 20% giá trị sản phẩm, phí xử lý hỏng hóc thấp hơn.',
    depositRate: 0.2,
    damageProcessingFee: 50000,
  },
];

const seedPolicy = async (policy: (typeof policies)[number]) => {
  try {
    await prisma.policy.upsert({
      where: { id: policy.id },
      update: {
        description: policy.description,
        depositRate: policy.depositRate,
        damageProcessingFee: policy.damageProcessingFee,
      },
      create: {
        id: policy.id,
        description: policy.description,
        depositRate: policy.depositRate,
        damageProcessingFee: policy.damageProcessingFee,
      },
    });
    console.log(
      `Chính sách "${policy.description}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật chính sách "${policy.description}":`,
      error,
    );
  }
};

const seedPolicies = async () => {
  console.log('--- Bắt đầu seed chính sách ---');
  try {
    await Promise.all(
      policies.map(async (policy) => {
        await seedPolicy(policy);
      }),
    );
    console.log('--- Seed chính sách hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed chính sách:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedPolicies();
}

export default seedPolicies;
