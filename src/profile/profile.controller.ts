import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/decorators';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@User() user: any) {
    return this.profileService.getProfile(user.email);
  }
}
