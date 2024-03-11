import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators';
import { Role } from 'src/common/enums/enum';
import { UserEntity } from 'src/common/shared/userEntity';
import { InventoryDto, UpdateInventoryDto } from './dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('/:farmId/add')
  @HttpCode(201)
  @Roles(Role.Farmer)
  addToInventory(@Param('farmId') farmId: string, @Body() dto: InventoryDto) {
    return this.inventoryService.addToInventory(farmId, dto);
  }

  @Get('/:farmId')
  @HttpCode(200)
  @Roles(Role.Farmer)
  getAllInventory(@User() user: UserEntity, @Param('farmId') farmId: string) {
    return this.inventoryService.getAllInventory(user.sub, farmId);
  }

  @Get('/:farmId/:inventoryId')
  @HttpCode(200)
  @Roles(Role.Farmer, Role.Admin)
  getInventoryById(
    @User() user: UserEntity,
    @Param('farmId') farmId: string,
    @Param('inventoryId') inventoryId: string,
  ) {
    return this.inventoryService.getInventoryById(
      inventoryId,
      user.sub,
      farmId,
    );
  }

  @Put('/:farmId')
  @HttpCode(200)
  @Roles(Role.Farmer)
  updateInventoryItem(
    @Param('inventoryId') inventoryId: string,
    @User() user: UserEntity,
    @Param('farmId') farmId: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateInventoryItem(
      inventoryId,
      user.sub,
      farmId,
      dto,
    );
  }

  @Delete('/:farmId/:inventoryId')
  @HttpCode(200)
  @Roles(Role.Farmer)
  deleteInventoryItem(
    @Param('farmId') farmId: string,
    @Param('inventoryId') inventoryId: string,
    @User() user: UserEntity,
  ) {
    return this.inventoryService.deleteInventoryItem(
      inventoryId,
      user.sub,
      farmId,
    );
  }

  @Delete('/:farmId')
  @HttpCode(200)
  @Roles(Role.Farmer)
  clearInventory(@User() user: UserEntity, @Param('farmId') farmId: string) {
    return this.inventoryService.clearInventory(user.sub, farmId);
  }
}
