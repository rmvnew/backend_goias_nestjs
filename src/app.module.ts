import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { AddressModule } from './address/address.module';
import { PhoneModule } from './phone/phone.module';
import { ContractModule } from './contract/contract.module';
import { PersonModule } from './person/person.module';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: true
    }),
    CompanyModule,
    AddressModule,
    PhoneModule,
    ContractModule,
    PersonModule,
    ClientModule,
    UserModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
