import { PrismaClient } from '@prisma/client';
import categorySeed from './category.seed';
import discountSeed from './discount.seed';
import equipmentPackageSeed from './equipment-package.seed';
import equipmentSeed from './equipment.seed';
import userSeed from './user.seed';
import policySeed from './policy.seed';
import maintenanceSeed from './maintenance.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- Đang bắt đầu quá trình seeding dữ liệu ---');

    await userSeed();
    console.log('Đã hoàn thành việc thêm người dùng.');

    await categorySeed();
    console.log('Đã hoàn thành việc thêm danh mục.');

    await equipmentSeed();
    console.log('Đã hoàn thành việc thêm thiết bị.');

    await equipmentPackageSeed();
    console.log('Đã hoàn thành việc thêm gói thiết bị.');

    await policySeed();
    console.log('Đã hoàn thành việc thêm chính sách.');

    await discountSeed();
    console.log('Đã hoàn thành việc thêm mã giảm giá.');

    await maintenanceSeed();
    console.log('Đã hoàn thành việc thêm bảo trì.');

    console.log('--- Quá trình seeding dữ liệu hoàn tất ---');
  } catch (e) {
    console.error('Lỗi trong quá trình seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Lỗi khi thực thi seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
