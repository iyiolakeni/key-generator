import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {
  CreatedResponse,
  DataResponse,
  UpdatedResponse,
} from 'src/model/success_response';
import {
  NotFoundErrorResponse,
  UnexpectedErrorResponse,
} from 'src/model/error_response';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<CreatedResponse | UnexpectedErrorResponse> {
    const applicationExist = await this.appRepo.findOne({
      where: { name: createApplicationDto.name },
    });

    if (applicationExist) {
      return new NotFoundErrorResponse(
        `Application with name ${createApplicationDto.name} already exists`,
      );
    }

    const application = this.appRepo.create(createApplicationDto);
    try {
      const savedApplication = await this.appRepo.save(application);
      return new CreatedResponse(
        `Application ${savedApplication.name} created successfully`,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to create application: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<
    DataResponse<Application[]> | UnexpectedErrorResponse
  > {
    try {
      const applications = await this.appRepo.find({
        where: { isActive: true },
      });
      if (applications.length === 0) {
        return new NotFoundErrorResponse('No applications found');
      }

      return new DataResponse(
        'Applications retrieved successfully',
        applications,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to retrieve applications: ${error.message}`,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<
    DataResponse<Application> | NotFoundErrorResponse | UnexpectedErrorResponse
  > {
    try {
      const application = await this.appRepo.findOne({
        where: { id },
      });

      if (!application) {
        return new NotFoundErrorResponse(`Application with id ${id} not found`);
      }

      return new DataResponse(
        `Application with id ${id} retrieved successfully`,
        application,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to retrieve application with id ${id}: ${error.message}`,
      );
    }
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.appRepo.findOne({ where: { id } });

    if (!application) {
      return new NotFoundErrorResponse(`Application with id ${id} not found`);
    }

    try {
      const updatedApplication = await this.appRepo.update(
        application.id,
        updateApplicationDto,
      );
      return new DataResponse(
        `Application with id ${id} updated successfully`,
        updatedApplication,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to update application with id ${id}: ${error.message}`,
      );
    }
  }

  async activate(
    id: string,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | UnexpectedErrorResponse
  > {
    const application = await this.appRepo.findOne({ where: { id } });

    if (!application) {
      return new NotFoundErrorResponse(`Application with id ${id} not found`);
    }

    if (application.isActive) {
      return new NotFoundErrorResponse('Application is already activated');
    }

    try {
      application.isActive = true;
      await this.appRepo.update(application.id, application);
      return new UpdatedResponse(
        `Application with id ${id} activated successfully`,
        200,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to activate application with id ${id}: ${error.message}`,
      );
    }
  }

  async deActivate(
    id: string,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | UnexpectedErrorResponse
  > {
    const application = await this.appRepo.findOne({ where: { id } });

    if (!application) {
      return new NotFoundErrorResponse(`Application with id ${id} not found`);
    }

    if (!application.isActive) {
      return new NotFoundErrorResponse('Application is already deactivated');
    }

    try {
      application.isActive = false;
      await this.appRepo.update(application.id, application);
      return new UpdatedResponse(
        `Application with id ${id} activated successfully`,
        200,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to activate application with id ${id}: ${error.message}`,
      );
    }
  }

  async delete(
    id: string,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | UnexpectedErrorResponse
  > {
    const application = await this.appRepo.findOne({ where: { id } });

    if (!application) {
      return new NotFoundErrorResponse(`Application with id ${id} not found`);
    }

    try {
      await this.appRepo.delete(id);
      return new UpdatedResponse(
        `Application with id ${id} deleted successfully`,
        200,
      );
    } catch (error) {
      return new UnexpectedErrorResponse(
        `Failed to delete application with id ${id}: ${error.message}`,
      );
    }
  }
}
