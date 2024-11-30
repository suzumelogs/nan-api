import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const equipmentPackages = [
  {
    id: '5fbb1a2c3c9d440000e12350',
    name: 'Gói thiết bị làm mát',
    description: 'Gói thiết bị gồm các sản phẩm làm mát như quạt và điều hòa.',
    basePrice: 400000,
    rentalPrice: 400000,
    image:
      'https://cellphones.com.vn/media/wysiwyg/May-anh/DSLR/may-anh-dslr-1.jpg',
  },
  {
    id: '5fbb1a2c3c9d440000e12351',
    name: 'Gói thiết bị gia đình',
    description:
      'Gói thiết bị gồm các sản phẩm gia đình thiết yếu như quạt, máy lọc không khí.',
    basePrice: 250000,
    rentalPrice: 250000,
    image:
      'https://cellphones.com.vn/media/wysiwyg/May-anh/DSLR/may-anh-dslr-1.jpg',
  },
  {
    id: '5fbb1a2c3c9d440000e12352',
    name: 'Gói thiết bị nhà bếp',
    description:
      'Gói thiết bị gồm các sản phẩm phục vụ cho nhà bếp như lò vi sóng và máy rửa chén.',
    basePrice: 500000,
    rentalPrice: 500000,
    image:
      'https://cellphones.com.vn/media/wysiwyg/May-anh/DSLR/may-anh-dslr-1.jpg',
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
        basePrice: equipmentPackage.basePrice,
        rentalPrice: equipmentPackage.rentalPrice,
        image: equipmentPackage.image,
      },
      create: {
        id: equipmentPackage.id,
        name: equipmentPackage.name,
        description: equipmentPackage.description,
        basePrice: equipmentPackage.basePrice,
        rentalPrice: equipmentPackage.rentalPrice,
        image: equipmentPackage.image,
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
