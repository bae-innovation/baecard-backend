import { z, type ZodSchema } from 'zod';

/**
 * Creates a Zod schema for a response object that can be either a successful
 * response with a given data type or an error response with a given error type.
 *
 * The schema is a discriminated union with a single discriminator key 'success'.
 * If 'success' is true, the response object will have a 'data' key with the given
 * data type and an optional 'message' key (normalized to '' when omitted). If
 * 'success' is false, the response object will have a 'message' key (normalized when
 * omitted) and an 'error' key
 * with the given error type.
 *
 * @param dataSchema - The schema for the response data if the response is successful.
 * @param errorSchema - The schema for the error data if the response is an error response.
 * @returns A Zod schema for a response object that can be either a successful response
 * or an error response with the given data and error types.
 *
 * @example
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 * const responseSchema = createResponseSchema(userSchema, errorSchema);
 * console.log(responseSchema);
 *
 * // responseSchema is equivalent to:
 * // | {
 * //     success: true;
 * //     data: {
 * //       id: number;
 * //       name: string;
 * //     };
 * //     message: string;
 * //   }
 * // | {
 * //     success: false;
 * //     message: string;
 * //     error: {
 * //       code: number;
 * //       message: string;
 * //     };
 * //   }
 *
 * @see https://zod.dev/?id=discriminated-unions
 */
export const createResponseSchema = <
  TData extends z.ZodTypeAny = z.ZodUnknown,
  TError extends z.ZodTypeAny = z.ZodUnknown,
>(
  dataSchema: TData = z.unknown() as unknown as TData,
  errorSchema: TError = z.unknown() as unknown as TError,
) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: dataSchema,
      message: z.string().optional().default(''),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().optional().default(''),
      error: errorSchema,
    }),
  ]);

// Type helpers
// Improved type helpers with ZodSchema constraints

/**
 * Type of a successful response with a given data type.
 *
 * @example
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 *
 * type UserResponse = SuccessResponse<typeof userSchema>;
 *
 * // UserResponse is equivalent to:
 * // {
 * //   success: true;
 * //   data: {
 * //     id: number;
 * //     name: string;
 * //   };
 * //   message: string;
 * // }
 */
export type SuccessResponse<T extends ZodSchema> = z.infer<
  ReturnType<typeof createResponseSchema<T, z.ZodUnknown>>
> & { success: true };

/**
 * Type of an error response with a given error type.
 *
 * @example
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 *
 * type ErrorResponse = ErrorResponse<typeof errorSchema>;
 *
 * // ErrorResponse is equivalent to:
 * // {
 * //   success: false;
 * //   message: string;
 * //   error: {
 * //     code: number;
 * //     message: string;
 * //   };
 * // }
 */
export type ErrorResponse<R extends ZodSchema> = z.infer<
  ReturnType<typeof createResponseSchema<z.ZodUnknown, R>>
> & { success: false };

/**
 * Union type representing either a successful or an error response.
 *
 * @template T - The Zod schema for the data when the response is successful.
 * @template R - The Zod schema for the error when the response is unsuccessful.
 *
 * @example
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 *
 * type ApiResponse = ResponseSchema<typeof userSchema, typeof errorSchema>;
 *
 * // ApiResponse is equivalent to:
 * // | {
 * //     success: true;
 * //     data: {
 * //       id: number;
 * //       name: string;
 * //     };
 * //     message: string;
 * //   }
 * // | {
 * //     success: false;
 * //     message: string;
 * //     error: {
 * //       code: number;
 * //       message: string;
 * //     };
 * //   }
 */
export type ResponseSchema<T extends ZodSchema, R extends ZodSchema> =
  | SuccessResponse<T>
  | ErrorResponse<R>;

// Laravel Pagination Support

/**
 * Laravel pagination metadata schema (without the data array).
 * This represents the pagination-specific fields in Laravel's paginated response.
 *
 * @example
 * {
 *   total: 50,
 *   per_page: 15,
 *   current_page: 1,
 *   last_page: 4,
 *   current_page_url: "http://laravel.app?page=1",
 *   first_page_url: "http://laravel.app?page=1",
 *   last_page_url: "http://laravel.app?page=4",
 *   next_page_url: "http://laravel.app?page=2",
 *   prev_page_url: null,
 *   path: "http://laravel.app",
 *   from: 1,
 *   to: 15,
 *   data: [...]
 * }
 */
const laravelPaginationMetaSchema = z
  .object({
    current_page: z.number(),
    /** Present in older Laravel paginator JSON; omitted in Laravel 11+ API responses. */
    current_page_url: z.string().nullable().optional(),
    first_page_url: z.string().nullable().optional(),
    from: z.number().nullable(),
    last_page: z.number(),
    last_page_url: z.string().nullable().optional(),
    next_page_url: z.string().nullable(),
    path: z.string(),
    per_page: z.number(),
    prev_page_url: z.string().nullable(),
    to: z.number().nullable(),
    total: z.number(),
    links: z.array(z.unknown()).optional(),
  })
  .strip();

/**
 * Type representing Laravel pagination metadata (without the data array).
 * This is the structure returned by parsePaginatedResponse in the pagination field.
 */
export type LaravelPaginationMeta = z.infer<typeof laravelPaginationMetaSchema>;

/**
 * Creates a Zod schema for a paginated response that wraps Laravel's pagination format.
 * The response can be either a successful paginated response or an error response.
 *
 * @param itemSchema - The schema for each item in the paginated data array
 * @param errorSchema - The schema for the error data if the response is an error response
 * @returns A Zod schema for a paginated response object
 *
 * @example
 * const productSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 * const errorSchema = z.object({
 *   code: z.number(),
 *   message: z.string(),
 * });
 * const paginatedResponseSchema = createPaginatedResponseSchema(productSchema, errorSchema);
 *
 * // The schema validates responses like:
 * // {
 * //   success: true,
 * //   data: {
 * //     current_page: 1,
 * //     data: [{ id: 1, name: "Product 1" }, ...],
 * //     total: 100,
 * //     per_page: 15,
 * //     last_page: 7,
 * //     ...
 * //   },
 * //   message: "Products retrieved successfully"
 * // }
 */
export function createPaginatedResponseSchema<
  TData extends z.ZodTypeAny = z.ZodUnknown,
  TError extends z.ZodTypeAny = z.ZodUnknown,
>(
  itemSchema: TData = z.unknown() as unknown as TData,
  errorSchema: TError = z.unknown() as unknown as TError,
) {
  // Combine pagination metadata with the data array
  const paginatedDataSchema = laravelPaginationMetaSchema.extend({
    data: z.array(itemSchema),
  });

  return createResponseSchema(paginatedDataSchema, errorSchema);
}

/**
 * Type of a successful paginated response with a given item type.
 *
 * @example
 * const productSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 *
 * type PaginatedProductResponse = PaginatedResponse<typeof productSchema>;
 *
 * // PaginatedProductResponse is equivalent to:
 * // {
 * //   success: true;
 * //   data: {
 * //     current_page: number;
 * //     data: Array<{ id: number; name: string }>;
 * //     total: number;
 * //     per_page: number;
 * //     last_page: number;
 * //     ...
 * //   };
 * //   message: string;
 * // }
 */
export type PaginatedResponse<T extends ZodSchema> = z.infer<
  ReturnType<typeof createPaginatedResponseSchema<T, z.ZodUnknown>>
> & { success: true };

/**
 * Type representing the parsed paginated data structure.
 * This is the return type of parsePaginatedResponse.
 *
 * @example
 * const productSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 *
 * type PaginatedProducts = PaginatedData<typeof productSchema>;
 *
 * // PaginatedProducts is equivalent to:
 * // {
 * //   data: Array<{ id: number; name: string }>;
 * //   pagination: LaravelPaginationMeta;
 * // }
 */
export type PaginatedData<T extends ZodSchema> = {
  data: z.infer<T>[];
  pagination: LaravelPaginationMeta;
};

// // Basic usage with unknown types
// const basicSchema = createResponseSchema();
// export type BasicResponse = z.infer<typeof basicSchema>;

// // Example valid objects:
// const basicSuccessResponse = {
//   success: true,
//   data: { id: 1, name: 'John' },
//   message: 'User found',
// };

// const parsedBasicSuccessResponse = basicSchema.parse(basicSuccessResponse);
// if (!parsedBasicSuccessResponse.success) {
//   console.error(parsedBasicSuccessResponse.error);
// } else {
//   console.log(parsedBasicSuccessResponse.data);
// }

// // With specific data and error types
// const userSchema = z.object({
//   id: z.number(),
//   name: z.string(),
// });

// const errorSchema = z.object({
//   code: z.number(),
//   details: z.array(z.string()),
// });

// const typedSchema = createResponseSchema(userSchema, errorSchema);
// export type TypedResponse = z.infer<typeof typedSchema>;

// // Example valid objects:
// const successResponse = {
//   success: true,
//   data: { id: 1, name: 'John' },
//   message: 'User found',
// };

// const parsedSuccessResponse = typedSchema.parse(successResponse);
// if (!parsedSuccessResponse.success) {
//   console.error(parsedSuccessResponse.error);
// } else {
//   console.log(parsedSuccessResponse.data);
// }

// const errorResponse = {
//   success: false,
//   message: 'Database error',
//   error: { code: 500, details: ['Connection timeout'] },
// };

// const parsedErrorResponse = typedSchema.parse(errorResponse);
// if (!parsedErrorResponse.success) {
//   console.error(parsedErrorResponse.error);
// } else {
//   console.log(parsedErrorResponse.data);
// }
