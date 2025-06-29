import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from 'src/key/entities/key.entity';
import { Application } from 'src/application/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Key, Application])],
  providers: [SharedService],
  exports: [SharedService, TypeOrmModule.forFeature([Key, Application])],
})
export class SharedModule {}
