import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyDto } from './create-key.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateKeyDto extends PartialType(CreateKeyDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  regenerateValue?: boolean;
}
