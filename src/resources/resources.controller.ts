import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourceDto } from './dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async addResource(@Body() dto: ResourceDto) {
    return this.resourcesService.addResource(dto);
  }

  @Get()
  async getResources() {
    return this.resourcesService.getResources();
  }

  @Get('/:id')
  async getResource(@Param('id') id: string) {
    return this.resourcesService.getResource(id);
  }

  @Delete('/:id')
  deleteResource(@Param('id') id: string) {
    return this.resourcesService.deleteResource(id);
  }
}
