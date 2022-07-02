import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { FilterUser } from 'src/profile/dto/filter.user';
import { Pagination } from 'nestjs-typeorm-paginate';
import { getUserPath } from 'src/common/utils/routes.path';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query() filter: FilterUser
  ): Promise<Pagination<User>> {

    const { limit } = filter

    filter.limit = limit > 10 ? 10 : limit

    filter.route = getUserPath()


    return this.userService.findAll(filter);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/status/:id')
  async changeStatus(
    @Param('id') id: number
  ): Promise<User> {
    return this.userService.changeStatus(id)
  }
}
