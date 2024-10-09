import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Máy tính xách tay',
    description:
      'Dòng máy tính xách tay với hiệu suất cao, phù hợp cho cả công việc và giải trí.',
  },
  {
    name: 'Máy ảnh kỹ thuật số',
    description:
      'Máy ảnh chất lượng cao với nhiều tính năng, lý tưởng cho nhiếp ảnh gia chuyên nghiệp và nghiệp dư.',
  },
  {
    name: 'Thiết bị âm thanh',
    description:
      'Các thiết bị âm thanh chuyên dụng như loa, tai nghe và ampli, phục vụ cho nhu cầu giải trí và nghe nhạc.',
  },
];

const seedCategory = async (category: (typeof categories)[number]) => {
  await prisma.category.upsert({
    where: { name: category.name },
    update: {},
    create: {
      name: category.name,
    },
  });

  console.log(`Category ${category.name} seeded successfully.`);
};

const categorySeed = async () => {
  try {
    for (const category of categories) {
      await seedCategory(category);
    }
  } catch (error) {
    console.error('Error seeding categories: ', error);
  } finally {
    await prisma.$disconnect();
  }
};

export default categorySeed;
