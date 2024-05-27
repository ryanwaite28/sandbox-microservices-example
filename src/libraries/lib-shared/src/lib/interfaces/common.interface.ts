import { UserEntity } from '../entities/users.entity';
import { HttpStatusCode } from '../enums/http-status-codes.enum';


export interface IPositionStackLocationData {
  latitude: number,
  longitude: number,
  label: string,
  name: string,
  type: string,
  number: string,
  street: string,
  postal_code: string,
  confidence: string,
  region: string,
  region_code: string,
  administrative_area: string,
  neighbourhood: string,
  country: string,
  country_code: string,
  map_url: string,
}

export interface PlainObject<T = any> {
  [key: string]: T;
}


export interface IAuthJwtResults {
  error: boolean,
  status: HttpStatusCode,
  message: string,
  you: UserEntity | null,
}


/**
 * @description 
 * Interface for validating data from requests
 */
 export interface IModelValidator {
  field: string,
  name: string,
  optional?: boolean,
  defaultValue?: any,
  validator: (arg: any) => boolean,
  errorMessage?: string,
}

export interface ServiceMethodResultsInfo<T = any> {
  message?: string;
  data?: T;
  error?: any;
};

/**
 * @interface ServiceMethodResults
 * 
 * @description
 * Interface for a service method return value.
 * - status: uses an http code to signify result of action
 * - error: flag to indicate if there was an error
 * - info: object that serves as details about the results
 */
export type ServiceMethodResults<T = any> = {
  status: HttpStatusCode,
  error: boolean,
  info: ServiceMethodResultsInfo<T>,
};

export type ServiceMethodAsyncResults<T = any> = Promise<ServiceMethodResults<T>>;

export type ModelValidators = IModelValidator[];
