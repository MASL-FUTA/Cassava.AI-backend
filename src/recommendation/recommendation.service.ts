import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClassificationDto } from './dto';

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

  private async base64ToImage(base64String: string) {
    try {
      const base64Image = base64String.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        '',
      );

      const binaryString = atob(base64Image);
      const length = binaryString.length;
      const bytes = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'image/png' });

      const url = URL.createObjectURL(blob);

      return url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getRecommendation(farmid: string) {
    try {
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
      const response = genText.response;
      const text = response.text();

      return JSON.parse(text);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async imageClassification(dto: ClassificationDto) {
    try {
      const headers = {
        'Content-type': 'application/json',
        'Prediction-Key': this.config.get<string>('prediction-key'),
      };

      const axiosConfig = {
        headers: headers,
      };

      const response = await axios.post(
        `https://cassavaimage-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/${this.config.get<string>(
          'link_id',
        )}/classify/iterations/Iteration1/url`,
        dto,
        axiosConfig,
      );
      const prediction = response.data.predictions[0];
      console.log(prediction);

      const genAI = new GoogleGenerativeAI(
        this.config.get<string>('GEMINI_API_KEY'),
      );

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.0-pro-latest',
      });

      const prompt = `
      I just discovered signs of ${prediction.tagName} in my cassava crop! This disease can be devastating, but don't panic. I'm looking for advice from experienced farmers on the best course of action.

      Specifically, I'd love to hear recommendations on:

      Containment strategies: How can I prevent the disease from spreading to unaffected cassava plants?
      Treatment options: Are there any chemical treatments available to save infected cassava plants, or should I focus on protecting healthy ones?
      Preventative measures for future crops: What steps can I take to make sure this disease doesn't strike again in the future?
      For the treatment, I want you to be as explicit as possible, suggesting possible chemical treatments and any additional tips or insights from cassava growers who have faced similar challenges would be greatly appreciated!

      Also note i want the response to be in plain text without markdown formatting.
      `;

      const genText = await model.generateContent(prompt);
      const genResponse = genText.response;
      const text = genResponse.text();

      return {
        message: 'Recommendation generated successfully',
        status: 'success',
        statusCode: 200,
        data: {
          prediction: {
            name: prediction.tagName,
            probability: prediction.probability,
          },
          recommendation: text.replaceAll('**', ''),
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
