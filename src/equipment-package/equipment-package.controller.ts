import { Controller } from '@nestjs/common';
import { EquipmentPackageService } from './equipment-package.service';

@Controller('equipment-package')
export class EquipmentPackageController {
  constructor(
    private readonly equipmentPackageService: EquipmentPackageService,
  ) {}
}
