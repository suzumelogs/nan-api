import { MaintenanceStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const maintenances = [
  {
    id: '64f21cddf1d2bc2b4d8f8c85',
    maintenanceDate: new Date('2024-11-01T10:00:00Z'),
    description: 'Kiểm tra và thay thế bộ lọc không khí.',
    suggestedNextMaintenance: new Date('2024-12-01T10:00:00Z'),
    status: MaintenanceStatus.pending,
    maintenanceCost: 500000,
    equipmentId: '5fbb1a2c3c9d440000e12345',
  },
  {
    id: '64f21cddf1d2bc2b4d8f8c86',
    maintenanceDate: new Date('2024-11-05T11:00:00Z'),
    description: 'Thay dầu và kiểm tra hiệu suất của quạt.',
    suggestedNextMaintenance: new Date('2025-01-05T11:00:00Z'),
    status: MaintenanceStatus.completed,
    maintenanceCost: 300000,
    equipmentId: '5fbb1a2c3c9d440000e12346',
  },
  {
    id: '64f21cddf1d2bc2b4d8f8c87',
    maintenanceDate: new Date('2024-11-10T14:00:00Z'),
    description: 'Kiểm tra và thay thế linh kiện trong máy lọc không khí.',
    suggestedNextMaintenance: new Date('2025-02-10T14:00:00Z'),
    status: MaintenanceStatus.pending,
    maintenanceCost: 450000,
    equipmentId: '5fbb1a2c3c9d440000e12347',
  },
];

const seedMaintenance = async (maintenance: (typeof maintenances)[0]) => {
  try {
    await prisma.maintenance.upsert({
      where: { id: maintenance.id },
      update: {
        maintenanceDate: maintenance.maintenanceDate,
        description: maintenance.description,
        suggestedNextMaintenance: maintenance.suggestedNextMaintenance,
        status: maintenance.status,
        maintenanceCost: maintenance.maintenanceCost,
        equipmentId: maintenance.equipmentId,
      },
      create: {
        id: maintenance.id,
        maintenanceDate: maintenance.maintenanceDate,
        description: maintenance.description,
        suggestedNextMaintenance: maintenance.suggestedNextMaintenance,
        status: maintenance.status,
        maintenanceCost: maintenance.maintenanceCost,
        equipmentId: maintenance.equipmentId,
      },
    });

    console.log(
      `Bảo trì "${maintenance.id}" đã được thêm hoặc cập nhật thành công.`,
    );
  } catch (error) {
    console.error(
      `Lỗi khi thêm hoặc cập nhật bảo trì "${maintenance.id}":`,
      error,
    );
  }
};

const seedMaintenances = async () => {
  try {
    console.log('--- Bắt đầu seed bảo trì ---');

    for (const maintenance of maintenances) {
      await seedMaintenance(maintenance);
    }

    console.log('--- Seed bảo trì hoàn tất ---');
  } catch (error) {
    console.error('Lỗi trong quá trình seed bảo trì:', error);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  seedMaintenances();
}

export default seedMaintenances;
