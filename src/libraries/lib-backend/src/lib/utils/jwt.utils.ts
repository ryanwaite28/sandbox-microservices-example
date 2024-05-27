import { Request, Response } from 'express';
import {
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';
import { LOGGER } from './logger.utils';
import { AUTH_BEARER_HEADER_REGEX, HttpStatusCode, IAuthJwtResults, UserEntity } from '@app/lib-shared';




export function generateJWT(data: any, secret?: string) {
  // console.log(`generateJWT:`, { data });
  try {
    const jwt_token = jwt_sign(data, secret || (<string> process.env.JWT_SECRET));
    return jwt_token || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function decodeJWT(token: any, secret?: string) {
  try {
    const data = jwt_verify(token, secret || (<string> process.env.JWT_SECRET));
    // console.log(`decodeJWT:`, { data });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}






export const AuthorizeJwt = (
  request: Request,
  response: Response,
  checkUrlYouIdMatch: boolean = true,
): IAuthJwtResults => {
  /*
    Check the request context.
    If is API request, the oauth access token (JWT) must have been valid 
    in order to make it this far in the request chain: pull the user object from the response locals;
    else (is web/mobile request), validate authorization header (JWT)
  */

  // if (response.locals[`IS_API_REQUEST`] && response.locals['API_KEY']) {
  //   LOGGER.info(`AuthorizeJwt called upon API Request; is valid auth`);
  //   const api_key: ApiKeyEntity = response.locals[`API_KEY`];
  //   /* Request is okay */
  //   const authData = {
  //     error: false,
  //     status: HttpStatusCode.OK,
  //     message: `user authorized`,
  //     you: api_key.user!,
  //   };

  //   console.log(`Request Authorized via API request:`);
  //   return authData;
  // }


  try {
    /* First, check Authorization header */
    const auth = request.get('Authorization');
    if (!auth) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: missing Authorization header`,
        you: null,
      };
    }
    const isNotBearerFormat = !AUTH_BEARER_HEADER_REGEX.test(auth);
    if (isNotBearerFormat) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: Authorization header must be Bearer format`,
        you: null,
      };
    }

    /* Check token validity */
    const token = auth.split(' ')[1];
    let you;
    try {
      you = decodeJWT(token) || null;
    } catch (e) {
      console.log(e);
      you = null;
    }
    if (!you) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: invalid token`,
        you: null,
      };
    }

    /* Check if user id match the `you_id` path param IF checkUrlIdMatch = true */
    if (checkUrlYouIdMatch) {
      const you_id: number = parseInt(request.params.you_id, 10);
      const notYou: boolean = you_id !== (<UserEntity> you).id;
      if (notYou) {
        return {
          error: true,
          status: HttpStatusCode.UNAUTHORIZED,
          message: `Request not authorized: You are not permitted to complete this action`,
          you: null,
        };
      }
    }

    /* Request is okay */
    const authData = {
      error: false,
      status: HttpStatusCode.OK,
      message: `user authorized`,
      you: (<UserEntity> you),
    };

    console.log(`Request Authorized:`, );

    return authData;
  } catch (error) {
    console.log(`auth jwt error:`, error);
    return {
      error: true,
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: `Request auth failed...`,
      you: null,
    };
  }
};