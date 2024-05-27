import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthorizeJWT } from '../../utils/helpers.utils';






@Injectable()
export class UserIdsAreDifferent implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const you_id = parseInt(request.params.you_id, 10);
    const user_id = parseInt(request.params.user_id, 10);
    if (user_id === you_id) {
      throw new ForbiddenException({
        message: `user_id and you_id cannot be the same`,
      });
    }
    return true;
  }
}

// @Injectable()
// export class YouHasStripeConnect implements CanActivate {
//   constructor() {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();
//     const you = response.locals.you as UserEntity;
//     if (!you.stripe_account_verified) {
//       throw new ForbiddenException({
//         message: `You do not have verified stripe account`,
//       });
//     }
//     return true;
//   }
// }

// @Injectable()
// export class UserHasStripeConnect implements CanActivate {
//   constructor() {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();
//     const user = response.locals.user as UserEntity;
//     if (!user.stripe_account_verified) {
//       throw new ForbiddenException({
//         message: `User does not have verified stripe account`,
//       });
//     }
//     return true;
//   }
// }
