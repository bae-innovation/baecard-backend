import { z } from 'zod';
import {
  fromZodError,
  isZodErrorLike,
  ValidationError,
} from 'zod-validation-error';

import { logger } from '@/lib/logger/app-logger';
import {
  createPaginatedResponseSchema,
  createResponseSchema,
  type LaravelPaginationMeta,
  ResponseSchema,
} from '@/lib/schema';

/**
 * Creates a Zod schema that parses a JSON string into an array.
 * Returns an empty array if parsing fails or the value is not an array.
 * The array items are validated using the provided item schema.
 *
 * @param itemSchema - The Zod schema to validate each array item
 * @returns A Zod schema that transforms a JSON string into a validated array
 * @example
 * // For an array of numbers
 * const numberArray = jsonArray(z.coerce.number());
 * numberArray.parse('"[1, 2, 3]"'); // [1, 2, 3]
 *
 * // For an array of strings
 * const stringArray = jsonArray(z.string());
 * stringArray.parse('"[\"a\", \"b\"]"'); // ["a", "b"]
 */
export function jsonArray<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .preprocess((val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    }, z.array(itemSchema))
    .nullable();
}

/**
 * Creates a Zod schema that coerces values to numbers, handling multiple formats:
 * - Numbers: returned as-is
 * - String numbers: parsed to numbers (e.g., "123.45" -> 123.45)
 * - Comma-formatted strings: commas removed then parsed (e.g., "1,234.56" -> 1234.56)
 * - Empty strings, null, undefined: fail validation
 *
 * @returns A Zod number schema with preprocessing
 * @example
 * const schema = z.object({
 *   revenue: coerceFormattedNumber(),
 * });
 * schema.parse({ revenue: 1234.56 }); // { revenue: 1234.56 }
 * schema.parse({ revenue: "1234.56" }); // { revenue: 1234.56 }
 * schema.parse({ revenue: "1,234.56" }); // { revenue: 1234.56 }
 */
export function coerceFormattedNumber() {
  return z.preprocess((val) => {
    // If already a number, return as-is
    if (typeof val === 'number') return val;

    // If it's a string, remove commas and try to parse
    if (typeof val === 'string') {
      const cleaned = val.replace(/,/g, '');
      const parsed = Number(cleaned);
      return isNaN(parsed) ? val : parsed;
    }

    // For other types, return as-is and let Zod handle validation
    return val;
  }, z.number());
}

/**
 * Checks if a response is an error response.
 *
 * @param response - The response to check
 * @param errorSchema - The schema for the error
 * @returns true if the response is an error response, false otherwise
 * @example
 * const response = {
 *   success: false,
 *   error: {
 *     code: 500,
 *     message: 'Internal Server Error',
 *   },
 * };
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 * const result = isErrorResponse(response, errorSchema);
 * console.log(result); // true
 */
function isErrorResponse<TError extends z.ZodSchema>(
  response: unknown,
  errorSchema: TError,
): response is z.infer<
  ReturnType<typeof createResponseSchema<z.ZodUnknown, TError>>
> & {
  success: false;
} {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response &&
    errorSchema.safeParse(response.error).success
  );
}

/** Safe subset of error object for logging (no tokens, no full response body). */
function safeErrorSummary(error: unknown): {
  code?: number | string;
  message?: string;
} {
  if (error === null || typeof error !== 'object') return {};
  const o = error as Record<string, unknown>;
  return {
    ...(typeof o.code !== 'undefined' &&
    (typeof o.code === 'number' || typeof o.code === 'string')
      ? { code: o.code }
      : {}),
    ...(typeof o.message === 'string' ? { message: o.message } : {}),
  };
}

/**
 * Parses a response object and returns the data if the response is successful,
 * or throws an error if the response is an error response.
 *
 * @param data - The response data to parse
 * @param dataSchema - The schema for the response data if the response is successful
 * @param errorSchema - The schema for the error data if the response is an error response
 * @returns The parsed response data if the response is successful
 * @throws {ValidationError} If the response is an error response
 * @throws {Error} If the response is invalid or an unexpected error occurs
 * @example
 * const response = {
 *   success: true,
 *   data: { id: 1, name: 'John' },
 * };
 * const dataSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 * try {
 *   const result = parseResponse(response, dataSchema);
 *   console.log(result); // { id: 1, name: 'John' }
 * } catch (error) {
 *  // error will be either:
 *  // - ZodError (schema validation failed)
 *  // - Error with message and cause (business logic error)
 *   console.error(error);
 * }
 *
 * @example
 * const response = {
 *   success: false,
 *   error: {
 *     code: 500,
 *     message: 'Internal Server Error',
 *   },
 * };
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 * try {
 *   parseResponse(response, z.unknown(), errorSchema);
 * } catch (error) {
 *   console.error(error); // ValidationError
 * }
 */
export function parseResponse<
  TData extends z.ZodSchema = z.ZodUnknown,
  TError extends z.ZodSchema = z.ZodUnknown,
>(
  data: unknown,
  dataSchema: TData = z.unknown() as unknown as TData,
  errorSchema: TError = z.unknown() as unknown as TError,
): z.infer<TData> {
  // Create the response schema
  const responseSchema = createResponseSchema(dataSchema, errorSchema);

  try {
    // Parse the response
    const result: ResponseSchema<TData, TError> = responseSchema.parse(data);

    // Use type guards to properly narrow the type
    if (isErrorResponse(result, errorSchema)) {
      logger.error('[API VALIDATION] Business logic error', {
        domain: 'api-validation',
        errorType: 'business_logic',
        errorMessage: result.message,
        errorSummary: safeErrorSummary(result.error),
      });

      throw new ValidationError(result.message, {
        cause: result.error,
      });
    }

    // Return data from success case
    return result.data;
  } catch (error) {
    // Enhance Zod errors with more context
    if (isZodErrorLike(error)) {
      logger.error('[API VALIDATION] Schema validation failed', {
        domain: 'api-validation',
        errorType: 'zod',
        errorMessage: error.message,
        errorPath:
          error.errors
            ?.map((e: { path: (string | number)[] }) => e.path.join('.'))
            .join(', ') || 'unknown',
      });
      throw fromZodError(error, { includePath: true });
    }

    logger.error('[API VALIDATION] Unexpected parsing error', {
      domain: 'api-validation',
      errorType: 'unknown',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// // With explicit schemas
// const userSchema = z.object({ id: z.number(), name: z.string() });
// const errorSchema = z.object({
//   code: z.number(),
//   details: z.array(z.string()),
// });

// const apiResponse = {
//   success: true,
//   data: { id: 1, name: 'John' },
//   message: 'User found',
// };
// try {
//   const userData = parseResponse(apiResponse, userSchema, errorSchema);
//   // userData is typed as { id: number; name: string }
//   console.log(userData);
// } catch (error) {
//   console.error(error);
//   // error will be either:
//   // - ZodError (schema validation failed)
//   // - Error with message and cause (business logic error)
// }

// // With default unknown types
// try {
//   const unknownData = parseResponse(apiResponse);
//   // unknownData is typed as unknown
//   console.log(unknownData);
// } catch (error) {
//   console.error(error);
//   // Handle any type of error
// }

// // With just data schema
// try {
//   const numbers = parseResponse(apiResponse, z.array(z.number()));
//   // numbers is typed as number[]
//   console.log(numbers);
// } catch (error) {
//   // Handle errors
//   console.error(error);
// }

/**
 * Parses a paginated response object and returns both the data array and pagination metadata
 * if the response is successful, or throws an error if the response is an error response.
 *
 * This function is designed for Laravel's standard pagination format, where the response
 * wraps paginated data with metadata like current_page, total, per_page, etc.
 *
 * @param data - The response data to parse
 * @param itemSchema - The schema for each item in the paginated data array
 * @param errorSchema - The schema for the error data if the response is an error response
 * @returns An object containing the data array and pagination metadata
 * @throws {ValidationError} If the response is an error response
 * @throws {Error} If the response is invalid or an unexpected error occurs
 *
 * @example
 * const response = {
 *   success: true,
 *   data: {
 *     current_page: 1,
 *     data: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }],
 *     total: 100,
 *     per_page: 15,
 *     last_page: 7,
 *     // ... other pagination fields
 *   },
 *   message: 'Products retrieved successfully',
 * };
 * const productSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 * try {
 *   const result = parsePaginatedResponse(response, productSchema);
 *   console.log(result.data); // [{ id: 1, name: 'Product 1' }, ...]
 *   console.log(result.pagination); // { current_page: 1, total: 100, ... }
 * } catch (error) {
 *   // error will be either:
 *   // - ZodError (schema validation failed)
 *   // - Error with message and cause (business logic error)
 *   console.error(error);
 * }
 *
 * @example
 * // With error schema
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 * try {
 *   const result = parsePaginatedResponse(response, productSchema, errorSchema);
 *   // Use result.data and result.pagination
 * } catch (error) {
 *   // Handle validation or business logic errors
 *   console.error(error);
 * }
 */
export function parsePaginatedResponse<
  TData extends z.ZodSchema = z.ZodUnknown,
  TError extends z.ZodSchema = z.ZodUnknown,
>(
  data: unknown,
  itemSchema: TData = z.unknown() as unknown as TData,
  errorSchema: TError = z.unknown() as unknown as TError,
): {
  data: z.infer<TData>[];
  pagination: LaravelPaginationMeta;
} {
  const responseSchema = createPaginatedResponseSchema(itemSchema, errorSchema);

  try {
    // Parse the response
    const parsed = responseSchema.parse(data);

    // Use type guards to properly narrow the type
    if (isErrorResponse(parsed, errorSchema)) {
      logger.error('[API VALIDATION] Business logic error', {
        domain: 'api-validation',
        errorType: 'business_logic',
        errorMessage: parsed.message,
        errorSummary: safeErrorSummary(parsed.error),
      });

      throw new ValidationError(parsed.message, {
        cause: parsed.error,
      });
    }

    // Extract pagination metadata from the paginated data structure
    // The spread operator separates the items array from pagination metadata
    const { data: items, ...pagination } = parsed.data;

    return {
      data: items,
      pagination,
    };
  } catch (error) {
    // Enhance Zod errors with more context
    if (isZodErrorLike(error)) {
      logger.error('[API VALIDATION] Schema validation failed', {
        domain: 'api-validation',
        errorType: 'zod',
        errorMessage: error.message,
        errorPath:
          error.errors
            ?.map((e: { path: (string | number)[] }) => e.path.join('.'))
            .join(', ') || 'unknown',
      });
      throw fromZodError(error, { includePath: true });
    }

    logger.error('[API VALIDATION] Unexpected parsing error', {
      domain: 'api-validation',
      errorType: 'unknown',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// // With explicit schemas
// const userSchema = z.object({ id: z.number(), name: z.string() });
// const usersSchema = z.array(userSchema);
// const errorSchema = z.object({
//   code: z.number(),
//   details: z.array(z.string()),
// });

// const apiResponse = {
//   success: true,
//   data: [
//     { id: 1, name: 'John' },
//     { id: 2, name: 'Jane' },
//   ],
//   message: 'User found',
// };
// try {
//   const userData = parseResponse(apiResponse, usersSchema, errorSchema);
//   // userData is typed as { id: number; name: string }
//   console.log(userData);
// } catch (error) {
//   console.error(error);
//   // error will be either:
//   // - ZodError (schema validation failed)
//   // - Error with message and cause (business logic error)
// }

// // // With default unknown types
// try {
//   const unknownData = parsePaginatedResponse(apiResponse);
//   // unknownData is typed as unknown
//   console.log(unknownData);
// } catch (error) {
//   console.error(error);
//   // Handle any type of error
// }

// // With just data schema
// try {
//   const numbers = parsePaginatedResponse(apiResponse, z.array(z.number()));
//   // numbers is typed as number[]
//   console.log(numbers);
// } catch (error) {
//   // Handle errors
//   console.error(error);
// }
