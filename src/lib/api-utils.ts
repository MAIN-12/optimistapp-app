import { NextResponse } from 'next/server';
import { ApiError, ValidationError } from '@/types/api';

export class ApiErrorHandler {
  static createError(
    statusCode: number,
    error: string,
    message: string,
    validationErrors?: Array<{ field: string; message: string }>
  ): NextResponse {
    const timestamp = new Date().toISOString();
    
    const errorResponse: ApiError | ValidationError = validationErrors
      ? {
          error,
          message,
          statusCode,
          timestamp,
          validationErrors
        }
      : {
          error,
          message,
          statusCode,
          timestamp
        };

    return NextResponse.json(errorResponse, { status: statusCode });
  }

  static badRequest(message: string, validationErrors?: Array<{ field: string; message: string }>): NextResponse {
    return this.createError(400, 'Bad Request', message, validationErrors);
  }

  static unauthorized(message: string = 'Authentication required'): NextResponse {
    return this.createError(401, 'Unauthorized', message);
  }

  static forbidden(message: string = 'Insufficient permissions'): NextResponse {
    return this.createError(403, 'Forbidden', message);
  }

  static notFound(message: string = 'Resource not found'): NextResponse {
    return this.createError(404, 'Not Found', message);
  }

  static conflict(message: string): NextResponse {
    return this.createError(409, 'Conflict', message);
  }

  static unprocessableEntity(message: string, validationErrors?: Array<{ field: string; message: string }>): NextResponse {
    return this.createError(422, 'Unprocessable Entity', message, validationErrors);
  }

  static internalServerError(message: string = 'Internal server error'): NextResponse {
    return this.createError(500, 'Internal Server Error', message);
  }
}

export function validateUuid(id: string, fieldName: string = 'id'): { field: string; message: string } | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid UUID`
    };
  }
  
  return null;
}

export function validateStringLength(
  value: string, 
  minLength: number = 0, 
  maxLength: number = Infinity, 
  fieldName: string = 'field'
): { field: string; message: string } | null {
  if (value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters long`
    };
  }
  
  if (value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters long`
    };
  }
  
  return null;
}

export function validateRequired(value: any, fieldName: string): { field: string; message: string } | null {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0)) {
    return {
      field: fieldName,
      message: `${fieldName} is required`
    };
  }
  
  return null;
}