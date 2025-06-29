import { Module } from '@nestjs/common';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Key } from './entities/key.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Key]), SharedModule],
  controllers: [KeyController],
  providers: [KeyService],
})
export class KeyModule {}
