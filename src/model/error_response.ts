export class ErrorResponse {
  message: string;
  success: boolean;
  statusCode: number;
  error: string;

  constructor(message: string, error: string, statusCode: number = 400) {
    this.message = message;
    this.success = false;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class ValidationErrorResponse extends ErrorResponse {
  validationErrors: Record<string, string[]>;

  constructor(
    message: string,
    validationErrors: Record<string, string[]>,
    statusCode: number = 422,
  ) {
    super(message, 'Validation Error', statusCode);
    this.validationErrors = validationErrors;
  }
}

export class NotFoundErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 404) {
    super(message, 'Not Found', statusCode);
  }
}

export class UnauthorizedErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 401) {
    super(message, 'Unauthorized', statusCode);
  }
}

export class ForbiddenErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 403) {
    super(message, 'Forbidden', statusCode);
  }
}

export class InternalServerErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'Internal Server Error', statusCode);
  }
}

export class ConflictErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 409) {
    super(message, 'Conflict', statusCode);
  }
}

export class BadRequestErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 400) {
    super(message, 'Bad Request', statusCode);
  }
}

export class ServiceUnavailableErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 503) {
    super(message, 'Service Unavailable', statusCode);
  }
}

export class GatewayTimeoutErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 504) {
    super(message, 'Gateway Timeout', statusCode);
  }
}

export class TooManyRequestsErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 429) {
    super(message, 'Too Many Requests', statusCode);
  }
}

export class InvalidCredentialsErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 401) {
    super(message, 'Invalid Credentials', statusCode);
  }
}

export class UnexpectedErrorResponse extends ErrorResponse {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'Error', statusCode);
  }
}
