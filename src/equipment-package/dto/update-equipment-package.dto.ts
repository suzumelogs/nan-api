import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentPackageDto } from './create-equipment-package.dto';

export class UpdateEquipmentPackageDto extends PartialType(
  CreateEquipmentPackageDto,
) {}
