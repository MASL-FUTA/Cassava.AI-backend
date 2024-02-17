import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Public } from 'src/decorators';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Public()
  @Get('/:farmid')
  getRec(@Param('farmid') farmid: string) {
    return this.recommendationService.getRecommendation(farmid);
  }
}
