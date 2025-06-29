import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { KeyType } from '../enum';

export class CreateKeyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  applicationId: string;

  @ApiProperty()
  @IsEnum(KeyType)
  type: KeyType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(8)
  @Max(256)
  length?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  suffix?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  includeNumbers?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  includeSymbols?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  includeUppercase?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  includeLowercase?: boolean;
}
