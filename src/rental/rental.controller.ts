import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { RentalService } from './rental.service';

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

  @Get('history/by-me')
  @ApiOperation({
    summary: 'Get rental history',
    description: 'Retrieve rental history for a specific user.',
  })
  @Auth(Role.user)
  getHistoryByMe(@GetUser() user: User) {
    return this.rentalService.getHistoryByMe(user?.id);
  }
}
