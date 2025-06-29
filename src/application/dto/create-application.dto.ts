import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
