import { describe, expect, expectTypeOf, test } from 'vitest';
import { z } from 'zod';
import { ValidationError } from 'zod-validation-error';

import { parseResponse } from '@/utils/api-validation';

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const errorSchema = z.object({
  code: z.number(),
  details: z.array(z.string()),
});

describe('parseResponse', () => {
  describe('success cases', () => {
    test('should parse valid success response with explicit schemas', () => {
      const validSuccessResponse = {
        success: true,
        data: { id: 1, name: 'John' },
        message: 'User found',
      };

      const result = parseResponse(
        validSuccessResponse,
        userSchema,
        errorSchema,
      );

      expect(result).toEqual(validSuccessResponse.data);
      expectTypeOf(result).toEqualTypeOf<{ id: number; name: string }>();
    });

    test('should parse success response with default unknown type', () => {
      const validSuccessResponse = {
        success: true,
        data: { any: 'shape' },
        message: 'Unknown data',
      };

      const result = parseResponse(validSuccessResponse);

      expect(result).toEqual(validSuccessResponse.data);
      expectTypeOf(result).toEqualTypeOf<unknown>();
    });
  });

  describe('error cases', () => {
    test('should throw ValidationError for valid error response structure', () => {
      const validErrorResponse = {
        success: false,
        message: 'Database error',
        error: {
          code: 500,
          details: ['Connection timeout'],
        },
      };

      expect(() =>
        parseResponse(validErrorResponse, userSchema, errorSchema),
      ).toThrow(ValidationError);
    });

    test('should include error details in cause', () => {
      const validErrorResponse = {
        success: false,
        message: 'Validation failed',
        error: {
          code: 400,
          details: ['Invalid name'],
        },
      };

      try {
        parseResponse(validErrorResponse, userSchema, errorSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        // Error is now a ValidationError, so narrow the type
        expect((error as ValidationError).message).toBe('Validation failed');
        expect((error as ValidationError).cause).toEqual(
          validErrorResponse.error,
        );
        type ExpectedError = z.infer<typeof errorSchema>;
        expectTypeOf(
          (error as ValidationError).cause as ExpectedError,
        ).toEqualTypeOf<z.infer<typeof errorSchema>>();
      }
    });
  });

  describe('schema validation failures', () => {
    test('should throw enhanced Zod error for invalid success response', () => {
      const invalidSuccessResponse = {
        success: true,
        data: { id: '1' }, // Invalid type
        message: 'User found',
      };

      expect(() =>
        parseResponse(invalidSuccessResponse, userSchema, errorSchema),
      ).toThrow();

      try {
        parseResponse(invalidSuccessResponse, userSchema, errorSchema);
      } catch (error) {
        // Verify the error is wrapped by zod-validation-error
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/Validation error/);
        expect((error as Error).cause).toBeInstanceOf(z.ZodError);
      }
    });

    test('should throw enhanced Zod error for invalid error response', () => {
      const invalidErrorResponse = {
        success: false,
        message: 'Error',
        error: 'Simple string', // Should be object
      };

      expect(() =>
        parseResponse(invalidErrorResponse, userSchema, errorSchema),
      ).toThrow();

      try {
        parseResponse(invalidErrorResponse, userSchema, errorSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/Validation error/);
        expect((error as Error).cause).toBeInstanceOf(z.ZodError);
      }
    });

    test('should throw enhanced Zod error for missing success field', () => {
      const invalidResponse = {
        data: { id: 1, name: 'John' },
        message: 'Missing success field',
      };

      try {
        parseResponse(invalidResponse, userSchema, errorSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/Validation error/);
        expect((error as Error).cause).toBeInstanceOf(z.ZodError);
      }
    });
  });

  describe('type inference', () => {
    test('should infer correct error type', () => {
      const errorResponse = {
        success: false,
        message: 'Error',
        error: { code: 500, details: [] },
      };

      try {
        parseResponse(errorResponse, userSchema, errorSchema);
      } catch (error) {
        if (error instanceof ValidationError) {
          type ExpectedError = z.infer<typeof errorSchema>;
          expectTypeOf(
            (error as ValidationError).cause as ExpectedError,
          ).toEqualTypeOf<z.infer<typeof errorSchema>>();
        }
      }
    });

    test('should infer data type from schema', () => {
      const successResponse = {
        success: true,
        data: { id: 1, name: 'John' },
        message: 'Success',
      };

      const result = parseResponse(successResponse, userSchema, errorSchema);
      expectTypeOf(result).toEqualTypeOf<z.infer<typeof userSchema>>();
    });
  });

  describe('error formatting', () => {
    test('should format Zod errors with fromZodError', () => {
      const invalidResponse = {
        success: true,
        data: { id: 'invalid' },
        message: 123, // Invalid message type
      };

      try {
        parseResponse(invalidResponse, userSchema, errorSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/Validation error/);
        expect((error as Error).message).toMatch(
          /Expected string, received number/,
        );
        expect((error as Error).cause).toBeInstanceOf(z.ZodError);
      }
    });
  });
});
