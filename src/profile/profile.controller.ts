import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';

@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto
  ): Promise<ProfileEntity> {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<ProfileEntity[]> {
    return this.profileService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<ProfileEntity> {
    return this.profileService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<ProfileEntity> {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string
  ) {
    return this.profileService.remove(+id);
  }
}
