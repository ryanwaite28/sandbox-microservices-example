/*
  Singleton class for containing all environment variables.
  Will contain common environment variable names for common use cases such as "APP_NAME"
  and will also contain app specific keys.

  The purpose of this class is to have parsed and static typing for environment variable values and to stop the random use of `process.env` throughout the codebase.
  Every/Any environment variable should be defined and accessed here. If it is app specific, siimply create an object key for it here.
*/

import { generateJWT, decodeJWT } from "./jwt.utils";



 

export class AppEnvironment {
  /*
    The name of the running application.
    This value is mainly used for logging but could also used for other purposes
    such as generating object key names if needed.

    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly APP_NAME = {
    MACHINE: process.env['APP_MACHINE_NAME'],
    DISPLAY: process.env['APP_DISPLAY_NAME'],
    COMPONENT: process.env['COMPONENT'],
  };

  public static readonly RABBIT_MQ_URL: string = process.env['RABBITMQ_URL']!;
  public static readonly REDIS_URL: string = process.env['REDIS_URL']!;
  
  public static readonly SERVER_DOMAIN: string = process.env['SERVER_DOMAIN']!;
  public static readonly USE_COOKIE_DOMAIN: string = process.env['USE_COOKIE_DOMAIN']!;
  public static readonly USE_CLIENT_DOMAIN_NAME: string = process.env[`USE_CLIENT_DOMAIN_NAME`];
  public static readonly USE_CLIENT_DOMAIN_PORT: string = process.env[`USE_CLIENT_DOMAIN_PORT`];
  public static readonly USE_CLIENT_DOMAIN_URL: string = process.env[`USE_CLIENT_DOMAIN_URL`];
  
  public static readonly SHARED_STORAGE_VOL_PATH: string = process.env[`SHARED_STORAGE_VOL_PATH`];

  /*
  
  */

  public static readonly CORS = {
    WHITELIST: process.env[`CORS_WHITELIST_ORIGINS`] ? process.env[`CORS_WHITELIST_ORIGINS`].split(',') : []
  };

  public static readonly SOCKETS = {
    WHITELIST: process.env[`SOCKET_WHITELIST_ORIGINS`] ? process.env[`SOCKET_WHITELIST_ORIGINS`].split(',') : []
  };


  /*
  
  */

  public static readonly AWS = {
    SES: {
      EMAIL: process.env[`PLATFORM_AWS_SES_EMAIL`]!,
      ARN: process.env[`PLATFORM_AWS_SES_ARN`]!,
      
      EMAIL_INTERNAL_SENDER: process.env[`PLATFORM_AWS_SES_EMAIL_INTERNAL_SENDER`]!,
      EMAIL_INTERNAL_RECEIVER: process.env[`PLATFORM_AWS_SES_EMAIL_INTERNAL_RECEIVER`]!,
      ARN_INTERNAL: process.env[`PLATFORM_AWS_SES_ARN_INTERNAL`]!,
    },
    S3: {
      BUCKET: process.env[`PLATFORM_AWS_S3_BUCKET`]!,
      ARN: process.env[`PLATFORM_AWS_S3_BUCKET_ARN`]!,
      SERVE_ORIGIN: process.env[`PLATFORM_AWS_S3_BUCKET_SERVE_ORIGIN`]!,
    }
  };




  /*
    JWT Secrets

    All apps are expected to use the same value for these keys
  */

  public static readonly JWT_SECRETS = {
    OAUTH: {
      SECRET: process.env['JWT_OAUTH_SECRET']!,
      encode: (value: any) => generateJWT(value, process.env['JWT_OAUTH_SECRET']!),
      decode: (value: any) => decodeJWT(value, process.env['JWT_OAUTH_SECRET']!),
    },

    USER: {
      SECRET: process.env['JWT_SECRET']!,
      encode: (value: any) => generateJWT(value, process.env['JWT_SECRET']!),
      decode: (value: any) => decodeJWT(value, process.env['JWT_SECRET']!),
    },

    ADMIN: {
      SECRET: process.env['JWT_ADMIN_SECRET']!,
      encode: (value: any) => generateJWT(value, process.env['JWT_ADMIN_SECRET']!),
      decode: (value: any) => decodeJWT(value, process.env['JWT_ADMIN_SECRET']!),
    },
  };

 

  /*
    This is the port that the server application listens on.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 4000;

 

  /*
    The App current working environment.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly APP_ENV = process.env['APP_ENV']?.toUpperCase();

 

  /*
    A convenience for checking what the current environment is.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly IS_ENV = {
    LOCAL: process.env['APP_ENV']?.toUpperCase() === `LOCAL`,
    DEV: process.env['APP_ENV']?.toUpperCase() === `DEV`,
    QA: process.env['APP_ENV']?.toUpperCase() === `QA`,
    PROD: process.env['APP_ENV']?.toUpperCase() === `PROD`,
  };




  /*
    The database connection configuration.
    All apps are expected and assumed to use/set these environment variable key names with their own values.
  */

  public static readonly database = {
    URL: process.env['DATABASE_URL'],

    SCHEMA: process.env['DATABASE_SCHEMA'],
    USERNAME: process.env['DATABASE_USER'],
    PASSWORD: process.env['DATABASE_PASS'],
    HOST: process.env['DATABASE_HOST'],
    PORT: process.env['DATABASE_PORT'] ? parseInt(process.env['DATABASE_PORT']) : 5432,
    NAME: process.env['DATABASE_NAME'],
    PROTOCOL: process.env['DATABASE_PROTOCOL'] || `postgres`, // most FINRA apps use postgreSQL so postgres is assumed

    // a convenience property

    CONNECTION_STRING: ((): string => {
      const USER = process.env['DATABASE_USER'];
      const PASSWORD = process.env['DATABASE_PASS'];
      const HOST = process.env['DATABASE_HOST'];
      const PORT = process.env['DATABASE_PORT'] ? parseInt(process.env['DATABASE_PORT']) : 5432;
      const DATABASE = process.env['DATABASE_NAME'];
      const PROTOCOL = process.env['DATABASE_PROTOCOL'];
 
      const connectionString: string = `${PROTOCOL}://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;
      return connectionString;
    })(),
  };


  public static readonly API_KEYS = Object.freeze({
    GOOGLE_MAPS: process.env['GOOGLE_MAPS_API_KEY'],
    STRIPE_PK: process.env['STRIPE_PK'],
    POSITIONSTACK: process.env['POSITIONSTACK_APIKEY'],
  });
  
  public static readonly API_SECRETS = Object.freeze({
    STRIPE_SK: process.env['STRIPE_SK'],
    MOBILE_APP_SECRET: process.env['MOBILE_APP_SECRET'],
  });

  /* 
    Splunk Http Event Collector
  */
  public static readonly SPLUNK_HTTP_COLLECTOR_TOKEN = process.env['SPLUNK_HTTP_COLLECTOR_TOKEN']!;
  public static readonly SPLUNK_HTTP_COLLECTOR_PORT = parseInt(process.env['SPLUNK_HTTP_COLLECTOR_PORT']!);
  public static readonly SPLUNK_HTTP_COLLECTOR_HOST = process.env['SPLUNK_HTTP_COLLECTOR_HOST']!;
  public static readonly SPLUNK_HTTP_COLLECTOR_ENDPOINT = process.env['SPLUNK_HTTP_COLLECTOR_ENDPOINT']!;

}