import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KeyService } from './key.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

@Controller('key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Post('create')
  create(@Body() createKeyDto: CreateKeyDto) {
    return this.keyService.create(createKeyDto);
  }

  @Get('getAll')
  findAll() {
    return this.keyService.findAll();
  }

  @Get('get-by/:id')
  findOne(@Param('id') id: string) {
    return this.keyService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateKeyDto: UpdateKeyDto) {
    return this.keyService.update(id, updateKeyDto);
  }

  @Get('get-by-application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.keyService.getAllKeysByApplicationId(applicationId);
  }

  @Post('activate/:id')
  activate(@Param('id') id: string) {
    return this.keyService.activateKey(id);
  }

  @Post('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.keyService.deactivateKey(id);
  }

  @Post('deactivate-expired')
  deactivateExpired() {
    return this.keyService.deactivateExpiredKeys();
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.keyService.remove(id);
  }

  @Delete('delete-by-application/:applicationId')
  removeByApplication(@Param('applicationId') applicationId: string) {
    return this.keyService.deleteAllKeysByApplicationId(applicationId);
  }
}
