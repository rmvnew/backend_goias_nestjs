import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AddressModule } from 'src/address/address.module';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    AddressModule,
    PersonModule
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule { }
