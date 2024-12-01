import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticalService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverallStatistics() {
    const totalUsers = await this.prisma.user.count();
    const totalEquipments = await this.prisma.equipment.count();
    const totalStock = await this.prisma.equipment.aggregate({
      _sum: {
        stock: true,
      },
    });
    const totalRentals = await this.prisma.rental.count();
    const totalCartItems = await this.prisma.cartItem.count();
    const totalMaintenance = await this.prisma.maintenance.count();
    const totalDamageReports = await this.prisma.damageReport.count();
    const totalFeedbacks = await this.prisma.feedback.count();

    return {
      totalUsers,
      totalEquipments,
      totalStock: totalStock._sum.stock,
      totalRentals,
      totalCartItems,
      totalMaintenance,
      totalDamageReports,
      totalFeedbacks,
    };
  }
}
