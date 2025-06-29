import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Application } from 'src/application/entities/application.entity';
import { CreateKeyDto } from 'src/key/dto/create-key.dto';
import { Key } from 'src/key/entities/key.entity';
import { KeyType } from 'src/key/enum';
import {
  BadRequestErrorResponse,
  NotFoundErrorResponse,
} from 'src/model/error_response';
import { DataResponse } from 'src/model/success_response';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepo: Repository<Key>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  async generateKey(options: Partial<CreateKeyDto>): Promise<string> {
    const {
      type,
      length = 32,
      prefix = '',
      suffix = '',
      includeNumbers = true,
      includeSymbols = false,
      includeUppercase = true,
      includeLowercase = true,
    } = options;

    switch (type) {
      case KeyType.UUID:
        return `${prefix}${uuidv4()}${suffix}`;

      case KeyType.JWT_SECRET:
        return this.generateSecureRandomString(64);

      case KeyType.ENCRYPTION_KEY:
        return randomBytes(32).toString('hex');

      case KeyType.API_KEY:
        const apiKey = this.generateCustomString(length, {
          includeNumbers,
          includeSymbols: false, // API keys typically don't include symbols
          includeUppercase,
          includeLowercase,
        });
        return `${prefix}${apiKey}${suffix}`;

      case KeyType.RANDOM_TOKEN:
        return randomBytes(length).toString('base64url');

      case KeyType.CUSTOM:
      default:
        const customKey = this.generateCustomString(length, {
          includeNumbers,
          includeSymbols,
          includeUppercase,
          includeLowercase,
        });
        return `${prefix}${customKey}${suffix}`;
    }
  }

  private generateSecureRandomString(length: number): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  private generateCustomString(
    length: number,
    options: {
      includeNumbers: boolean;
      includeSymbols: boolean;
      includeUppercase: boolean;
      includeLowercase: boolean;
    },
  ): string {
    let charset = '';

    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      charset =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }

    let result = '';
    const randomValues = randomBytes(length);

    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    return result;
  }

  async findApplicationById(
    id: string,
  ): Promise<
    DataResponse<Application> | NotFoundErrorResponse | BadRequestErrorResponse
  > {
    if (!id) {
      return new BadRequestErrorResponse('Application ID is required');
    }

    try {
      const application = await this.appRepo.findOne({
        where: { id },
        relations: ['keys'],
      });

      if (!application) {
        return new NotFoundErrorResponse('Application not found');
      }

      return new DataResponse<Application>(
        'Application found successfully',
        application,
        200,
      );
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation error code
        return new NotFoundErrorResponse('Application not found');
      }
      return new BadRequestErrorResponse('An unexpected error occurred');
    }
  }
}
