import {
  BadRequestException,
  Injectable,
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
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.config.get<string>(
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

  async getRecommendation(farmid: string) {
    try {
      // const user = await this.prisma.user.findMany({
      //   where: {
      //     id: userid,
      //   },
      //   include: {
      //     farms: {
      //       select: {
      //         id: true,
      //         location: true,
      //       },
      //     },
      //   },
      // });

      const farm = await this.prisma.farm.findUnique({
        where: {
          id: farmid,
        },
      });

      const weather = await this.getWeatherData(
        farm.location.latitude,
        farm.location.longitude,
      );
      const result = weather.data.main;

      // user[0].farms.forEach(async (farm) => {
      //   const response = await this.getWeatherData(
      //     farm.location.latitude,
      //     farm.location.longitude,
      //   );
      //   this.weatherResults.push({
      //     farm_id: farm.id,
      //     data: response.data.main,
      //   });
      // });
      // return weather;

      const genAI = new GoogleGenerativeAI(
        this.config.get<string>('GEMINI_API_KEY'),
      );

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.0-pro-latest',
      });

      const prompt = `I am looking for recommendations on actions to take on my cassava farm to maximize yield based on the current weather and soil conditions.

      My farm's soil data is as follows:
      
      pH: ${farm.soil.pH}
      Texture: ${farm.soil.texture}
      Moisture: ${farm.soil.moisture}
      Drainage: ${farm.soil.drainage}
      Organic matter (orgMatter): ${farm.soil.orgMatter}
      Compaction: ${farm.soil.compaction}
      Salinity: ${farm.soil.salinity}
      Erosion: ${farm.soil.erosion}
      The current weather data for my farm is:
      
      temp: ${result.temp} °C
      feels_like: ${result.feels_like} °C
      temp_min: ${result.temp_min} °C
      temp_max: ${result.temp_max} °C
      pressure: ${result.pressure} hPa
      humidity: ${result.humidity} %
      sea level: ${result.sea_level}
      ground level: ${result.grnd_level}
      Based on this information, I would like to know:
      
      What specific actions should I take on my cassava farm to maximize yield given the current weather and soil conditions?
      Are there any potential risks or concerns I should be aware of due to the current weather or soil conditions?
      Are there any additional factors I should consider that I haven't already mentioned?
      Please provide recommendations that are specific to my farm's conditions and cassava variety.

      Please generate a response in JSON format with the following keys and values:

      effect: An array of potential effects of the current weather on my cassava crops (e.g., water stress, heat stress, disease spread).
      actions: An array of recommended actions to take based on the identified effects (e.g., irrigation, pest control, adjusting planting schedule).
      additional considerations: An array of any other important factors I should be aware of (e.g., future weather forecasts, soil amendments).
      Ideally, the recommended actions should be specific to my farm's conditions and cassava variety.

      remove the markdown tags too
      
      Thank you!
      
      `;

      const genText = await model.generateContent(prompt);
      const response = await genText.response;
      const text = response.text();

      return JSON.parse(text);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
