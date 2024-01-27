import { Controller, Get } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Public, User } from 'src/decorators';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Public()
  @Get('/')
  getRec() {
    return this.recommendationService.getRecommendation(
      '65a08e86a5302fe6fa3335c0',
    );
  }
}
