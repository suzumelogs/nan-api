import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const equipmentPackages = [
  {
    id: '5fbb1a2c3c9d440000e12350',
    name: 'Gói thiết bị làm mát',
    description: 'Gói thiết bị gồm các sản phẩm làm mát như quạt và điều hòa.',
    pricePerDay: 400000,
    pricePerWeek: 2400000,
    pricePerMonth: 9600000,
  },
  {
    id: '5fbb1a2c3c9d440000e12351',
    name: 'Gói thiết bị gia đình',
    description:
      'Gói thiết bị gồm các sản phẩm gia đình thiết yếu như quạt, máy lọc không khí.',
    pricePerDay: 250000,
    pricePerWeek: 1500000,
    pricePerMonth: 6000000,
  },
  {
    id: '5fbb1a2c3c9d440000e12352',
    name: 'Gói thiết bị nhà bếp',
    description:
      'Gói thiết bị gồm các sản phẩm phục vụ cho nhà bếp như lò vi sóng và máy rửa chén.',
    pricePerDay: 500000,
    pricePerWeek: 3000000,
    pricePerMonth: 12000000,
  },
];

const seedEquipmentPackage = async (
  equipmentPackage: (typeof equipmentPackages)[0],
) => {
  try {
    await prisma.equipmentPackage.upsert({
      where: { id: equipmentPackage.id },
      update: {
        name: equipmentPackage.name,
        description: equipmentPackage.description,
        pricePerDay: equipmentPackage.pricePerDay,
        pricePerWeek: equipmentPackage.pricePerWeek,
        pricePerMonth: equipmentPackage.pricePerMonth,
      },
      create: {
        id: equipmentPackage.id,
        name: equipmentPackage.name,
        description: equipmentPackage.description,
        pricePerDay: equipmentPackage.pricePerDay,
        pricePerWeek: equipmentPackage.pricePerWeek,
        pricePerMonth: equipmentPackage.pricePerMonth,
      },
    });

    console.log(
      `Gói thiết bị "${equipmentPackage.name}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật gói thiết bị "${equipmentPackage.name}":`,
      error,
    );
  }
};

const seedEquipmentPackages = async () => {
  try {
    console.log('--- Bắt đầu seed gói thiết bị ---');

    for (const equipmentPackage of equipmentPackages) {
      await seedEquipmentPackage(equipmentPackage);
    }

    console.log('--- Seed gói thiết bị hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed gói thiết bị:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedEquipmentPackages();
}

export default seedEquipmentPackages;
