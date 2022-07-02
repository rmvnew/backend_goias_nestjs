import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AddressModule } from 'src/address/address.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AddressModule,
    PersonModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
