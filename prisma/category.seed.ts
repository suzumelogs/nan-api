import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    id: '5fbb1a2c3c9d440000a12345',
    name: 'Thiết bị gia đình',
    description:
      'Các thiết bị phục vụ cho nhu cầu sinh hoạt hàng ngày trong gia đình.',
  },
  {
    id: '5fbb1a2c3c9d440000a12346',
    name: 'Thiết bị điện tử',
    description:
      'Các thiết bị điện tử hiện đại phục vụ cho giải trí và công việc.',
  },
  {
    id: '5fbb1a2c3c9d440000a12347',
    name: 'Thiết bị nhà bếp',
    description: 'Các dụng cụ, thiết bị hỗ trợ nấu ăn và chuẩn bị thực phẩm.',
  },
  {
    id: '5fbb1a2c3c9d440000a12348',
    name: 'Thiết bị làm mát',
    description:
      'Các sản phẩm giúp làm mát không gian sống như quạt, điều hòa.',
  },
  {
    id: '5fbb1a2c3c9d440000a12349',
    name: 'Thiết bị bảo vệ',
    description:
      'Các thiết bị giúp bảo vệ an ninh, sức khỏe cho gia đình như camera, máy lọc không khí.',
  },
];

const seedCategory = async (category: (typeof categories)[number]) => {
  await prisma.category.upsert({
    where: { id: category.id },
    update: {},
    create: {
      id: category.id,
      name: category.name,
      description: category.description,
    },
  });

  console.log(`Danh mục ${category.name} đã được thêm thành công.`);
};

const categorySeed = async () => {
  try {
    await prisma.category.deleteMany({});
    console.log('Đã xóa tất cả các danh mục cũ.');

    for (const category of categories) {
      await seedCategory(category);
    }
  } catch (error) {
    console.error('Lỗi khi thêm danh mục: ', error);
  } finally {
    await prisma.$disconnect();
  }
};

export default categorySeed;
