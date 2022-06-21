import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { PhoneModule } from 'src/phone/phone.module';
import { ContractModule } from 'src/contract/contract.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    PhoneModule,
    ContractModule,
    ClientModule
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule { }
