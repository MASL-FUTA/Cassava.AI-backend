import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
// import { ChatOpenAI } from '@langchain/openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RecommendationService {
  private weatherResults = [];
  constructor(
    private config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private async getWeatherData(lat: string, lon: string): Promise<any> {
    console.log(this.config.get('WEATHER_API_KEY'));
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

      // const weather = await this.getWeatherData('6.9433717', '3.3211776');
      // console.log(weather.data);

      user[0].farms.forEach(async (farm) => {
        const response = await this.getWeatherData(
          farm.location.latitude,
          farm.location.longitude,
        );
        this.weatherResults.push({
          farm_id: farm.id,
          data: response.data,
        });
      });
      // return weather;

      const genAI = new GoogleGenerativeAI(
        this.config.get<string>('GEMINI_API_KEY'),
      );

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.0-pro-latest',
      });

      const prompt = 'write a story about nigerian yoruba folklore';

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(text);

      return this.weatherResults;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
