import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Loa',
  },
  {
    name: 'Đài',
  },
  {
    name: 'Quạt',
  },
  {
    name: 'Điều hòa',
  },
  {
    name: 'Máy chiếu',
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
