import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) { }

  async create(createProfileDto: CreateProfileDto): Promise<ProfileEntity> {

    const { profile_name: name } = createProfileDto

    const profile = this.profileRepository.create(createProfileDto)

    profile.profile_name = name.toUpperCase()

    const isRegistered = await this.findByName(profile.profile_name)

    if (isRegistered) {
      throw new BadRequestException(`Perfil já cadastrado`)
    }


    return this.profileRepository.save(profile)
  }

  async findByName(profile_name: string): Promise<ProfileEntity> {
    return this.profileRepository.findOne({
      where: {
        profile_name
      }
    })
  }

  async findAll(): Promise<ProfileEntity[]> {
    return this.profileRepository.find()
  }

  async findById(id: number): Promise<ProfileEntity> {
    return this.profileRepository.findOne({
      where: {
        profile_id: id
      }
    })
  }

  async update(id: number, updateProfileDto: UpdateProfileDto): Promise<ProfileEntity> {

    const { profile_name: name } = updateProfileDto

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Perfil não encontrado`)
    }

    const profile = await this.profileRepository.preload({
      profile_id: id,
      ...updateProfileDto
    })

    if (name) {
      profile.profile_name = name.toUpperCase()
    }

    await this.profileRepository.save(profile)


    return this.findById(id)
  }

  async remove(id: number) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Perfil não encontrado`)
    }

    await this.profileRepository.remove(isRegistered)

  }
}
