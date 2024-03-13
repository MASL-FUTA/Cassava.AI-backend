import {
  Controller,
  HttpCode,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto, UpdateFarmDto } from './dto';
import { User } from 'src/decorators';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/enum';
import { UserEntity } from 'src/common/shared/userEntity';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @Roles(Role.Admin, Role.Farmer)
  @HttpCode(201)
  createFarm(@User() user: UserEntity, @Body() dto: CreateFarmDto) {
    return this.farmService.createFarm(user, dto);
  }

  @Get()
  @HttpCode(200)
  @Roles(Role.Admin, Role.Farmer)
  getAllFarms(@User() user: UserEntity, @Query('page') page: number = 1) {
    return this.farmService.getFarms(user.sub, page);
  }

  @Get('/:farmid')
  @HttpCode(200)
  @Roles(Role.Admin, Role.Farmer)
  getFarmById(@User() user: UserEntity, @Param('farmid') farmid: string) {
    return this.farmService.getById(user.sub, farmid);
  }

  @Get('/:farmid/tasks')
  @HttpCode(200)
  getAllTasks(@Param('farmid') farmid: string, @Query('page') page: number = 1) {
    return this.farmService.getAllTasks(farmid, page);
  }

  @Put('/:farmid')
  @HttpCode(200)
  @Roles(Role.Admin, Role.Farmer)
  updateFarm(
    @User() user: UserEntity,
    @Param('farmid') farmid: string,
    @Body() dto: UpdateFarmDto,
  ) {
    return this.farmService.updateFarm(user.sub, farmid, dto);
  }

  @Delete('/:farmid')
  @HttpCode(200)
  @Roles(Role.Admin, Role.Farmer)
  deleteFarm(@User() user: UserEntity, @Param('farmid') farmid: string) {
    return this.farmService.deleteFarm(user.sub, farmid);
  }
}
