import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';

@ApiBearerAuth()
@ApiTags('Rentals')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all rentals',
    description: 'Retrieve a list of all rentals available.',
  })
  findAll(): Promise<Rental[]> {
    return this.rentalService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get rental by ID',
    description: 'Retrieve rental details by its ID.',
  })
  findOne(@Param('id') id: string): Promise<Rental> {
    return this.rentalService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new rental',
    description: 'Create a new rental with the provided details.',
  })
  create(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalService.create(createRentalDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update rental by ID',
    description: 'Update the details of an existing rental by its ID.',
  })
  update(
    @Param('id') id: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    return this.rentalService.update(id, updateRentalDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete rental by ID',
    description: 'Delete a rental by its ID.',
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.rentalService.remove(id);
  }
}
