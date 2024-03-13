import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourceDto } from './dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async addResource(@Body() dto: ResourceDto) {
    return this.resourcesService.addResource(dto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @HttpCode(200)
  async getResources() {
    return this.resourcesService.getResources();
  }

  @Get('/:id')
  @HttpCode(200)
  @UseInterceptors(CacheInterceptor)
  async getResource(@Param('id') id: string) {
    return this.resourcesService.getResource(id);
  }

  @Delete('/:id')
  @HttpCode(200)
  deleteResource(@Param('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}
