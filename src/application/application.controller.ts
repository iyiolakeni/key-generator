import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('create')
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(createApplicationDto);
  }

  @Get('getAll')
  findAll() {
    return this.applicationService.findAll();
  }

  @Get('get-by/:id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Patch('updated/:id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.update(id, updateApplicationDto);
  }

  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.applicationService.activate(id);
  }

  @Patch('activate/:id')
  deActivate(@Param('id') id: string) {
    return this.applicationService.deActivate(id);
  }
}
