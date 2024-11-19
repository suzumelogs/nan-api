import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const equipments = [
  {
    id: '5fbb1a2c3c9d440000e12345',
    name: 'Quạt điều hòa',
    image: 'https://link-to-image.com/fan.jpg',
    description:
      'Quạt điều hòa giúp làm mát không gian sống, tiết kiệm điện năng.',
    pricePerDay: 100000,
    pricePerWeek: 650000,
    pricePerMonth: 2500000,
    stock: 20,
    categoryId: '5fbb1a2c3c9d440000a12348',
  },
  {
    id: '5fbb1a2c3c9d440000e12346',
    name: 'Máy lọc không khí',
    image: 'https://link-to-image.com/air-purifier.jpg',
    description:
      'Máy lọc không khí giúp không gian sống luôn trong lành và sạch sẽ.',
    pricePerDay: 150000,
    pricePerWeek: 900000,
    pricePerMonth: 3600000,
    stock: 15,
    categoryId: '5fbb1a2c3c9d440000a12349',
  },
  {
    id: '5fbb1a2c3c9d440000e12347',
    name: 'Lò vi sóng',
    image: 'https://link-to-image.com/microwave.jpg',
    description:
      'Lò vi sóng giúp hâm nóng và nấu các món ăn nhanh chóng và tiện lợi.',
    pricePerDay: 200000,
    pricePerWeek: 1200000,
    pricePerMonth: 4800000,
    stock: 30,
    categoryId: '5fbb1a2c3c9d440000a12347',
  },
  {
    id: '5fbb1a2c3c9d440000e12348',
    name: 'Điều hòa không khí',
    image: 'https://link-to-image.com/air-conditioner.jpg',
    description:
      'Điều hòa không khí giúp làm mát và làm lạnh không gian sống hiệu quả.',
    pricePerDay: 300000,
    pricePerWeek: 1800000,
    pricePerMonth: 7200000,
    stock: 10,
    categoryId: '5fbb1a2c3c9d440000a12348',
  },
];

const seedEquipment = async (equipment: (typeof equipments)[0]) => {
  try {
    await prisma.equipment.upsert({
      where: { id: equipment.id },
      update: {
        name: equipment.name,
        image: equipment.image,
        description: equipment.description,
        pricePerDay: equipment.pricePerDay,
        pricePerWeek: equipment.pricePerWeek,
        pricePerMonth: equipment.pricePerMonth,
        stock: equipment.stock,
        categoryId: equipment.categoryId,
      },
      create: {
        id: equipment.id,
        name: equipment.name,
        image: equipment.image,
        description: equipment.description,
        pricePerDay: equipment.pricePerDay,
        pricePerWeek: equipment.pricePerWeek,
        pricePerMonth: equipment.pricePerMonth,
        stock: equipment.stock,
        categoryId: equipment.categoryId,
      },
    });

    console.log(
      `Thiết bị "${equipment.name}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật thiết bị "${equipment.name}":`,
      error,
    );
  }
};

const seedEquipments = async () => {
  try {
    console.log('--- Bắt đầu seed thiết bị ---');

    for (const equipment of equipments) {
      await seedEquipment(equipment);
    }

    console.log('--- Seed thiết bị hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed thiết bị:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedEquipments();
}

export default seedEquipments;
