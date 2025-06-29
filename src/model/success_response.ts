export class SuccessResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  data: T;

  constructor(message: string, data: T, statusCode: number = 200) {
    this.message = message;
    this.success = true;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class DataResponse<T> extends SuccessResponse<T> {
  constructor(message: string, data: T, statusCode: number = 200) {
    super(message, data, statusCode);
  }
}

export class ArrayResponse<T> extends SuccessResponse<T[]> {
  constructor(message: string, data: T[], statusCode: number = 200) {
    super(message, data, statusCode);
  }
}

export class PaginatedResponse<T> extends SuccessResponse<T[]> {
  totalCount: number;
  pageSize: number;
  currentPage: number;

  constructor(
    message: string,
    data: T[],
    totalCount: number,
    pageSize: number,
    currentPage: number,
    statusCode: number = 200,
  ) {
    super(message, data, statusCode);
    this.totalCount = totalCount;
    this.pageSize = pageSize;
    this.currentPage = currentPage;
  }
}

export class EmptyResponse extends SuccessResponse<null> {
  constructor(message: string, statusCode: number = 204) {
    super(message, null, statusCode);
  }
}

export class NoContentResponse extends SuccessResponse<null> {
  constructor(message: string, statusCode: number = 204) {
    super(message, null, statusCode);
  }
}

export class CreatedResponse extends SuccessResponse<null> {
  constructor(message: string, statusCode: number = 201) {
    super(message, null, statusCode);
  }
}

export class UpdatedResponse extends SuccessResponse<null> {
  constructor(message: string, statusCode: number = 200) {
    super(message, null, statusCode);
  }
}

export class LoginResponse extends SuccessResponse<null> {
  constructor(message: string, statusCode: number = 200) {
    super(message, null, statusCode);
  }
}
