import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PhoneModule } from 'src/phone/phone.module';
import { Address } from 'src/address/entities/address.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Person,Address]),
    PhoneModule
  ],
  controllers: [PersonController],
  providers: [PersonService],
  exports:[PersonService]
})
export class PersonModule {}
