import { Controller, Delete, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/decorators';
import { UserEntity } from 'src/common/shared/userEntity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@User() user: any) {
    return this.profileService.getProfile(user.email);
  }

  @Delete()
  async deleteAccount(@User() user: UserEntity) {
    return this.profileService.deleteAccount(user.sub);
  }
}
