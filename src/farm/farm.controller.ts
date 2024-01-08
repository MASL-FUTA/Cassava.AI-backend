import {
  Controller,
  HttpCode,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto, UpdateFarmDto } from './dto';
import { User } from 'src/decorators';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(201)
  createFarm(@User() user, @Body() dto: CreateFarmDto) {
    return this.farmService.createFarm(user.sub, dto);
  }

  @Get()
  @HttpCode(200)
  getAllFarms(@User() user) {
    return this.farmService.getFarms(user.sub);
  }

  @Get('/:farmid')
  @HttpCode(200)
  getFarmById(@User() user, @Param('farmid') farmid: string) {
    return this.farmService.getById(user.sub, farmid);
  }

  @Put('/:farmid')
  @HttpCode(200)
  updateFarm(
    @User() user,
    @Param('farmid') farmid: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmService.updateFarm(user.sub, farmid, dto);
  }

  @Delete('/:farmid')
  @HttpCode(200)
  deleteFarm(@User() user, @Param('farmid') farmid: string) {
    return this.farmService.deleteFarm(user.sub, farmid);
  }
}
