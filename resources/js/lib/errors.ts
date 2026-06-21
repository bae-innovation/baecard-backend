export class HTTPError extends Error {
  /**
   * Construct an HTTPError with a given status code, message, and details.
   *
   * The `message` parameter is optional. If it is not provided, the error's
   * message will be set to `HTTP Error <status>`.
   *
   * The `details` parameter is optional, and can be used to provide additional
   * context about the error.
   *
   * @param status - The HTTP status code for the error.
   * @param message - The error message. Optional.
   * @param details - Additional error details. Optional.
   *
   * @example
   * const error = new HTTPError(404, 'Resource not found');
   * console.log(error.message); // 'Resource not found'
   */
  constructor(
    public status: number,
    public method?: string,
    public route?: string,
    message?: string,
    public details?: unknown,
  ) {
    super(message || `HTTP Error ${status}`);
    this.name = 'HTTPError';
  }
}

export class NetworkError extends Error {
  /**
   * Construct a NetworkError with a given message and details.
   *
   * The `message` parameter is optional. If it is not provided, the error's
   * message will be set to `'Network Error'`.
   *
   * The `details` parameter is optional, and can be used to provide additional
   * context about the error.
   *
   * @param message - The error message. Optional.
   * @param details - Additional error details. Optional.
   *
   * @example
   * const error = new NetworkError('Failed to connect to the server');
   * console.log(error.message); // 'Failed to connect to the server'
   */
  constructor(
    message?: string,
    public details?: unknown,
  ) {
    super(message || 'Network Error');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  /**
   * Construct a ValidationError with a given message and details.
   *
   * The `message` parameter is optional. If it is not provided, the error's
   * message will be set to `'Validation Error'`.
   *
   * The `details` parameter is optional, and can be used to provide additional
   * context about the error.
   *
   * @param message - The error message. Optional.
   * @param details - Additional error details. Optional.
   *
   * @example
   * const error = new ValidationError('Validation Error');
   * console.log(error.message); // 'Validation Error'
   */
  constructor(
    message?: string,
    public details?: unknown,
  ) {
    super(message || 'Validation Error');
    this.name = 'ValidationError';
  }
}

export class UnknownError extends Error {
  /**
   * Construct an UnknownError with a given message and details.
   *
   * The `message` parameter is optional. If it is not provided, the error's
   * message will be set to `'Unknown Error'`.
   *
   * The `details` parameter is optional, and can be used to provide additional
   * context about the error.
   *
   * @param message - The error message. Optional.
   * @param details - Additional error details. Optional.
   *
   * @example
   * const error = new UnknownError('An unexpected error occurred');
   * console.log(error.message); // 'An unexpected error occurred'
   */
  constructor(
    message?: string,
    public details?: unknown,
  ) {
    super(message || 'Unknown Error');
    this.name = 'UnknownError';
  }
}

/**
 * Check if the given error is an instance of HTTPError.
 *
 * @param error - The error to check.
 *
 * @returns A boolean indicating whether the given error is an instance of
 * HTTPError.
 *
 * @example
 * const error = new HTTPError(404, 'Resource not found');
 * console.log(isHTTPError(error)); // true
 *
 * const error = new NetworkError('Failed to connect to the server');
 * console.log(isHTTPError(error)); // false
 */
export function isHTTPError(error: unknown): error is HTTPError {
  return error instanceof HTTPError;
}

/**
 * Check if the given error is an instance of NetworkError.
 *
 * @param error - The error to check.
 *
 * @returns A boolean indicating whether the given error is an instance of
 * NetworkError.
 *
 * @example
 * const error = new NetworkError('Failed to connect to the server');
 * console.log(isNetworkError(error)); // true
 *
 * const error = new HTTPError(404, 'Resource not found');
 * console.log(isNetworkError(error)); // false
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Check if the given error is an instance of ValidationError.
 *
 * @param error - The error to check.
 *
 * @returns A boolean indicating whether the given error is an instance of
 * ValidationError.
 *
 * @example
 * const error = new ValidationError('Validation Error');
 * console.log(isValidationError(error)); // true
 *
 * const error = new HTTPError(404, 'Resource not found');
 * console.log(isValidationError(error)); // false
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if the given error is an instance of UnknownError.
 *
 * @param error - The error to check.
 *
 * @returns A boolean indicating whether the given error is an instance of
 * UnknownError.
 *
 * @example
 * const error = new UnknownError('An unexpected error occurred');
 * console.log(isUnknownError(error)); // true
 *
 * const error = new HTTPError(404, 'Resource not found');
 * console.log(isUnknownError(error)); // false
 */
export function isUnknownError(error: unknown): error is UnknownError {
  return error instanceof UnknownError;
}
