import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyModule } from './key/key.module';
import { ApplicationModule } from './application/application.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { SharedModule } from './shared/shared.module';

config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['src/**/entities/*.entity{.ts}'],
      synchronize: false,
      autoLoadEntities: true,
      migrationsRun: true,
    }),
    KeyModule,
    ApplicationModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
