import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Public } from 'src/decorators';
import { ClassificationDto } from './dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Public()
  @Get('/:farmid')
  getRec(@Param('farmid') farmid: string) {
    return this.recommendationService.getRecommendation(farmid);
  }

  @Public()
  @Post('/image')
  getImageClass(@Body() dto: ClassificationDto) {
    return this.recommendationService.imageClassification(dto);
  }
}
