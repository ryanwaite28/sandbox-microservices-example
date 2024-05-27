import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { AppEnvironment } from '../../utils/app.enviornment';
import { AuthorizeJwt } from '../..//utils/jwt.utils';
import {
  daysPast
} from '..//../utils/date.utils';
import { HttpStatusCode, UserEntity } from '@app/lib-shared';






@Injectable()
export class YouAuthorized implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const auth = AuthorizeJwt(request, response, true);
    
    if (auth.error) {
      throw new UnauthorizedException(auth);
    }

    response.locals.you = auth.you;
    return true;
  }
}



@Injectable()
export class YouAuthorizedSlim implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const auth = AuthorizeJwt(request, response, false);

    if (auth.error) {
      throw new UnauthorizedException(auth);
    }

    response.locals.you = auth.you;
    return true;
  }
}

@Injectable()
export class YouAuthorizedSlimWeak implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const auth = AuthorizeJwt(request, response, true);
    response.locals.you = auth.you;
    return true;
  }
}


// @Injectable()
// export class YouStripeIdentityIsNotVerified implements CanActivate {
//   constructor() {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();
    
//     const you: UserEntity = response.locals.you;

//     if (you.stripe_identity_verified) {
//       throw new ForbiddenException({
//         message: `Stripe Identity is verified`
//       });
//     }

//     return true;
//   }
// }

// @Injectable()
// export class YouStripeIdentityIsVerifiedAfter3DaysSinceSignup implements CanActivate {
//   constructor() {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();
    
//     const you: UserEntity = response.locals.you;

//     const userSignedUp3DaysAgo = daysPast(you.date_created) > 2;
//     const notIdentityVerifiedAfter3DaysSinceSignup = userSignedUp3DaysAgo && !you.stripe_identity_verified;

//     if (notIdentityVerifiedAfter3DaysSinceSignup) {
//       throw new ForbiddenException({
//         message: `Identity not verified. It has been more than 2 days since signup, your identity is now required to continue using the platform.`
//       });
//     }

//     return true;
//   }
// }



@Injectable()
export class XSRF_PROTECTED_2 implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const xsrf_token_a_cookie = request.cookies[`xsrf-token-a`];
    if (!xsrf_token_a_cookie) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        message: `xsrf-token-a cookie not found on request.`
      });
      return false;
    }

    const xsrf_token_b_cookie = request.cookies[`xsrf-token-b`];
    if (!xsrf_token_b_cookie) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        message: `xsrf-token-b cookie not found on request.`
      });
      return false;
    }

    const decrypted_cookie = AppEnvironment.JWT_SECRETS.USER.decode(xsrf_token_b_cookie);
    const match = decrypted_cookie === xsrf_token_a_cookie;
    if (!match) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        message: `xsrf-token cookies are invalid.`
      });
      return false;
    }

    return true;
  }
}

