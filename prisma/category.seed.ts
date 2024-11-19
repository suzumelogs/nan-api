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
  try {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
    console.log(
      `Danh mục "${category.name}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật danh mục "${category.name}":`,
      error,
    );
  }
};

const seedCategories = async () => {
  try {
    console.log('--- Bắt đầu seed danh mục ---');

    for (const category of categories) {
      await seedCategory(category);
    }

    console.log('--- Seed danh mục hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed danh mục:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedCategories();
}

export default seedCategories;
