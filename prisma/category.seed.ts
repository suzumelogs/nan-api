import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Gói sự kiện',
    description:
      'Gói thiết bị cho các sự kiện lớn như hội nghị, tiệc cưới, và lễ hội.',
    priceDay: 1500000, // 1.500.000 VND
    priceWeek: 9000000, // 9.000.000 VND
    priceMonth: 36000000, // 36.000.000 VND
  },
  {
    name: 'Gói nhóm ngoại khóa',
    description:
      'Gói dành cho các hoạt động ngoại khóa, bao gồm các thiết bị như loa, máy chiếu.',
    priceDay: 800000, // 800.000 VND
    priceWeek: 4800000, // 4.800.000 VND
    priceMonth: 19200000, // 19.200.000 VND
  },
  {
    name: 'Gói thiết bị văn phòng',
    description:
      'Gói thiết bị cho văn phòng bao gồm máy chiếu, thiết bị âm thanh và các công cụ hỗ trợ.',
    priceDay: 1200000, // 1.200.000 VND
    priceWeek: 7200000, // 7.200.000 VND
    priceMonth: 28800000, // 28.800.000 VND
  },
  {
    name: 'Gói giải trí',
    description:
      'Gói thiết bị giải trí cho các buổi tiệc hoặc hoạt động giải trí, bao gồm âm thanh và ánh sáng.',
    priceDay: 1000000, // 1.000.000 VND
    priceWeek: 6000000, // 6.000.000 VND
    priceMonth: 24000000, // 24.000.000 VND
  },
  {
    name: 'Gói tổ chức sự kiện',
    description:
      'Gói hoàn chỉnh để tổ chức sự kiện, bao gồm tất cả các thiết bị cần thiết cho sự kiện thành công.',
    priceDay: 2000000, // 2.000.000 VND
    priceWeek: 12000000, // 12.000.000 VND
    priceMonth: 48000000, // 48.000.000 VND
  },
];

const seedCategory = async (category: (typeof categories)[number]) => {
  await prisma.category.upsert({
    where: { name: category.name },
    update: {},
    create: {
      name: category.name,
      description: category.description,
      priceDay: category.priceDay,
      priceWeek: category.priceWeek,
      priceMonth: category.priceMonth,
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
