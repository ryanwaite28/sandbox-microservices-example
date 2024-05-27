import { NextFunction, Request, Response } from 'express';
import { FindAttributeOptions, GroupOption, Includeable, Order, WhereOptions } from 'sequelize';


export type ExpressMiddlewareFn = (
  request: Request, 
  response: Response, 
  next: NextFunction
) => Promise<void | Response<any>>;

export type ExpressResponse = Promise<Response<any>>;
export type ExpressRouteEndHandler = (
  request: Request, 
  response: Response
) => ExpressResponse;

export interface IPaginateModelsOptions {
  user_id_field: string,
  user_id?: number,
  min_id?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
}

export interface IRandomModelsOptions {
  limit?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
}