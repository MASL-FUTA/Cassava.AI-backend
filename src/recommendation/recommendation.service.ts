import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecommendationService {

  private weatherResults = [];
  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private async getWeatherData(lat: string, lon: string): Promise<any> {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.config.get<string>(
      'WEATHER_API_KEY',
    )}`;

    try {
      const response = await axios.get(apiUrl);

      return response;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Weather API call failed');
    }
  }

  async getRecommendation(userid: string) {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          id: userid,
        },
        include: {
          farms: {
            select: {
              id: true,
              location: true,
            },
          },
        },
      });

      const weather = await this.getWeatherData("6.9433717","3.3211776");
      // console.log(weather.data);

      user[0].farms.forEach(async (farm) => {
        const response = await this.getWeatherData(farm.location.latitude, farm.location.longitude);
        this.weatherResults.push(response.data)
      });
      // return weather;

      return this.weatherResults;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Recommendation could not be retrieved.',
      );
    }
  }
}
