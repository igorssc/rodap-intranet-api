import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

type ExceptionMessageProps = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as ExceptionMessageProps;

    const message = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message[0]
      : exceptionResponse.message;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
