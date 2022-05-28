import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Address } from 'src/address/entities/address.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Company,Address])
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
