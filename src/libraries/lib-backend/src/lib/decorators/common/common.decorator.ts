import { Request, Response } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';



export const ResponseLocals = createParamDecorator(
  (propName: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return response.locals[propName];
  },
);