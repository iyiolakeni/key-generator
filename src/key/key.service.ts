import { Injectable } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Key } from './entities/key.entity';
import { LessThan, Repository } from 'typeorm';
import {
  CreatedResponse,
  DataResponse,
  UpdatedResponse,
} from 'src/model/success_response';
import {
  BadRequestErrorResponse,
  InvalidCredentialsErrorResponse,
  NotFoundErrorResponse,
  UnexpectedErrorResponse,
} from 'src/model/error_response';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class KeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepo: Repository<Key>,
    private readonly sharedService: SharedService,
  ) {}

  async create(
    createKeyDto: CreateKeyDto,
  ): Promise<
    | CreatedResponse
    | InvalidCredentialsErrorResponse
    | UnexpectedErrorResponse
    | BadRequestErrorResponse
  > {
    if (!createKeyDto.applicationId) {
      return new BadRequestErrorResponse('Application ID is required');
    }

    const application = await this.sharedService.findApplicationById(
      createKeyDto.applicationId,
    );

    if (
      application instanceof BadRequestErrorResponse ||
      application instanceof NotFoundErrorResponse
    ) {
      return new InvalidCredentialsErrorResponse('Application Does not exist');
    }

    try {
      const keyValue = await this.sharedService.generateKey(createKeyDto);

      const key = this.keyRepo.create({
        ...createKeyDto,
        value: keyValue,
        expiresAt: createKeyDto.expiresAt
          ? new Date(createKeyDto.expiresAt)
          : null,
      });

      await this.keyRepo.save(key);

      return new CreatedResponse('Key created successfully', 200);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation error code
        return new InvalidCredentialsErrorResponse('Key already exists');
      }
      return new UnexpectedErrorResponse('An unexpected error occurred');
    }
  }

  async findAll(): Promise<DataResponse<Key[]> | NotFoundErrorResponse> {
    try {
      const keys = await this.keyRepo.find({
        relations: ['application'],
      });

      if (keys.length === 0) {
        return new NotFoundErrorResponse('No keys found');
      }

      return new DataResponse<Key[]>('Keys retrieved successfully', keys, 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('No keys found');
      }
      return new NotFoundErrorResponse('An unexpected error occurred');
    }
  }

  async findOne(
    id: string,
  ): Promise<
    DataResponse<Key> | BadRequestErrorResponse | NotFoundErrorResponse
  > {
    if (!id) {
      return new BadRequestErrorResponse('Key ID is required');
    }

    try {
      const key = await this.keyRepo.findOne({
        where: { id },
        relations: ['application'],
      });

      if (!key) {
        return new NotFoundErrorResponse('Key not found');
      }
      return new DataResponse<Key>('Key found successfully', key, 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Key not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }

  async update(
    id: string,
    updateKeyDto: UpdateKeyDto,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | BadRequestErrorResponse
  > {
    if (!id) {
      return new BadRequestErrorResponse('Key ID is required');
    }

    try {
      const key = await this.keyRepo.findOne({
        where: { id },
      });

      if (!key) {
        return new NotFoundErrorResponse('Key not found');
      }

      let newValue;
      if (updateKeyDto.regenerateValue) {
        newValue = await this.sharedService.generateKey({
          type: key.type,
          length: updateKeyDto.length,
          prefix: updateKeyDto.prefix,
          suffix: updateKeyDto.suffix,
          includeNumbers: updateKeyDto.includeNumbers,
          includeSymbols: updateKeyDto.includeSymbols,
          includeUppercase: updateKeyDto.includeUppercase,
          includeLowercase: updateKeyDto.includeLowercase,
        });
      }

      if (updateKeyDto.expiresAt) {
        key.expiresAt = new Date(updateKeyDto.expiresAt);
      }

      const updatedKey = {
        ...updateKeyDto,
        value: newValue,
      };

      await this.keyRepo.update(id, updatedKey);
      return new UpdatedResponse('Key updated successfully', 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Key not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }

  async remove(id: string): Promise<NotFoundErrorResponse | CreatedResponse> {
    const key = await this.keyRepo.findOne({
      where: { id },
    });

    if (!key) {
      return new NotFoundErrorResponse('Key not found');
    }

    try {
      await this.keyRepo.delete(id);
      return new CreatedResponse('Key deleted successfully', 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Key not found');
      }
      return new NotFoundErrorResponse('An unexpected error occurred');
    }
  }

  async getAllKeysByApplicationId(
    applicationId: string,
  ): Promise<
    DataResponse<Key[]> | NotFoundErrorResponse | BadRequestErrorResponse
  > {
    if (!applicationId) {
      return new BadRequestErrorResponse('Application ID is required');
    }

    try {
      const application =
        await this.sharedService.findApplicationById(applicationId);

      if (
        application instanceof BadRequestErrorResponse ||
        application instanceof NotFoundErrorResponse
      ) {
        return new NotFoundErrorResponse('Application not found');
      }

      const keys = await this.keyRepo.find({
        where: { applicationId: applicationId },
        relations: ['application'],
      });

      if (keys.length === 0) {
        return new NotFoundErrorResponse('No keys found for this application');
      }

      return new DataResponse<Key[]>('Keys retrieved successfully', keys, 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Application not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }

  async deactivateKey(
    id: string,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | BadRequestErrorResponse
  > {
    if (!id) {
      return new BadRequestErrorResponse('Key ID is required');
    }

    try {
      const key = await this.keyRepo.findOne({
        where: { id },
      });

      if (!key) {
        return new NotFoundErrorResponse('Key not found');
      }

      if (!key.isActive) {
        return new BadRequestErrorResponse('Key is already deactivated');
      }

      key.isActive = false;
      await this.keyRepo.save(key);

      return new UpdatedResponse('Key deactivated successfully', 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Key not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }

  async activateKey(
    id: string,
  ): Promise<
    UpdatedResponse | NotFoundErrorResponse | BadRequestErrorResponse
  > {
    if (!id) {
      return new BadRequestErrorResponse('Key ID is required');
    }

    try {
      const key = await this.keyRepo.findOne({
        where: { id },
      });

      if (!key) {
        return new NotFoundErrorResponse('Key not found');
      }

      if (key.isActive) {
        return new BadRequestErrorResponse('Key is already active');
      }

      key.isActive = true;
      await this.keyRepo.save(key);

      return new UpdatedResponse('Key deactivated successfully', 200);
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Key not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }

  async deactivateExpiredKeys(): Promise<
    UpdatedResponse | NotFoundErrorResponse
  > {
    try {
      const result = await this.keyRepo.update(
        { expiresAt: LessThan(new Date()), isActive: true },
        { isActive: false },
      );

      if (result.affected === 0) {
        return new NotFoundErrorResponse('No expired keys found');
      }

      return new UpdatedResponse('Expired keys deactivated successfully', 200);
    } catch (error) {
      return new NotFoundErrorResponse('An unexpected error occurred');
    }
  }
}
