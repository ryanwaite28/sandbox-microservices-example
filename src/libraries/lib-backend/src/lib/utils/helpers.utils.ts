import { CreateOptions, DestroyOptions, FindAttributeOptions, FindOptions, GroupOption, Includeable, Model, Order, UpdateOptions, WhereOptions } from 'sequelize';
import {
  SignOptions,
  VerifyOptions,
  sign as jwt_sign,
  verify as jwt_verify
} from 'jsonwebtoken';
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { UploadedFile } from 'express-fileupload';
import { allowedImages } from "./constants.utils";
import { validateName, validateEmail, validatePassword, numberValidator, genericTextValidator } from "./validators.utils";
import { getAll, getRandomModels, paginateTable } from "../repos/_common.repo";
import { HttpException } from "@nestjs/common";
import { ServiceMethodResults, UserEntity, IModelValidator, PlainObject, ServiceMethodAsyncResults, HttpStatusCode, BASE64_REGEX } from '@app/lib-shared';
import { IPaginateModelsOptions, IRandomModelsOptions } from '../interface/common.interface';
import { IMyModel, IUploadFile, MyModelStatic } from '../interface/sequelize.interface';
import { decodeJWT } from './jwt.utils';
import { writeFileSync } from 'fs';




export function decodeBase64(dataString: string) {
  let matches = dataString.match(BASE64_REGEX);
  let response: { file_type: string, file_data: Buffer } = {
    file_data: Buffer.from(''),
    file_type: '',
  };

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 input string');
  }

  response.file_type = matches[1];
  response.file_data = Buffer.from(matches[2], 'base64');

  if (!response.file_type || !response.file_data) {
    throw new Error(`Could not parse base64 string`);
  }

  return response;
}

export function upload_file(file: UploadedFile): Promise<IUploadFile> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject({error: true, filename: undefined, file_path: undefined, message: 'no file given...'});
    }
    const unique_filename = uniqueValue();
    const filename = unique_filename + (<string> file.name);
    const file_path = __dirname + '/' + filename;
    const filetype = file.mimetype;
    file.mv(file_path, (error: any) => {
      if (error) {
        return reject({error: true, filename: undefined, filetype, file_path: undefined, message: 'could not upload file...'});
      } else {
        return resolve({ error: false, filename, file_path, filetype: undefined, message: undefined });
      }
    });
  });
}

export function upload_base64(base64: string): Promise<IUploadFile> {
  return new Promise((resolve, reject) => {
    try {
      if (!base64) {
        return reject({error: true, filename: undefined, file_path: undefined, message: 'no base64 input given...'});
      }
  
      const fileBuffer = decodeBase64(base64);
      const filetype = fileBuffer.file_type;
      const filename = `${Date.now()}.${filetype.split('/')[1]}`;
      const file_path = __dirname + '/' + filename;
      console.log(`upload_base64:`, { filename, filetype, file_path });
      const writeOp = writeFileSync(file_path, fileBuffer.file_data);
      console.log(`successfully uploaded base64`);
      return resolve({ error: false, filename, file_path, filetype, message: undefined });
    }
    catch (e) {
      console.log(`upload_base64 error:`, e);
      return reject({ error: true, filename: undefined, filetype: undefined, file_path: undefined, message: 'could not upload file...' });
    }
  });
}

export function uniqueValue() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34);
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

export function getRandomIndex(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const indexList = array.map((item, index) => index);
  const randomIndex = Math.floor(Math.random() * indexList.length);
  const item = indexList[randomIndex];
  return item;
}

export function getRandomItem(array: any[]) {
  const badInput = !array || !array.length;
  if (badInput) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  const item = array[randomIndex];
  return item;
}






export const check_model_args = async (options: {
  model_id?: number,
  model?: IMyModel,
  model_name?: string,
  get_model_fn: (id: number) => Promise<IMyModel | null>
}) => {
  const { model_id, model, model_name, get_model_fn } = options;
  const useName = model_name || 'model';

  if (!model_id && !model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: `${useName} id or model instance is required.`
      }
    };
    return serviceMethodResults;
  }
  const model_model: IMyModel | null = model || await get_model_fn(model_id!);
  if (!model_model) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.NOT_FOUND,
      error: true,
      info: {
        message: `${useName} not found...`,
      }
    };
    return serviceMethodResults;
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      data: model_model,
    }
  };
  return serviceMethodResults;
};



export const create_user_required_props: IModelValidator[] = [
  // { field: `username`, name: `Username`, validator: validateUsername, errorMessage: `must be: at least 2 characters, alphanumeric, dashes, underscores, periods` },
  // { field: `displayname`, name: `DisplayName`, validator: validateDisplayName, errorMessage: `must be: at least 2 characters, alphanumeric, dashes, underscores, periods, spaces`, },
  { field: `firstname`, name: `First Name`, validator: validateName, errorMessage: `must be: at least 2 characters, letters only`, },
  // { field: `middlename`, name: `Middle Name`, validator: (arg: any) => !arg || validateName(arg), errorMessage: `must be: at least 2 characters, letters only`, },
  { field: `lastname`, name: `Last Name`, validator: validateName, errorMessage: `must be: at least 2 characters, letters only`, },
  { field: `email`, name: `Email`, validator: validateEmail, errorMessage: `is in bad format`, },
  { field: `password`, name: `Password`, validator: validatePassword, errorMessage: `Password must be: at least 7 characters, upper and/or lower case alphanumeric`, },
  { field: `confirmPassword`, name: `Confirm Password`, validator: validatePassword, errorMessage: `Confirm Password must be: at least 7 characters, upper and/or lower case alphanumeric`, },
];

export const VALID_RATINGS = new Set([1, 2, 3, 4, 5]);
export const create_rating_required_props: IModelValidator[] = [
  { field: `user_id`, name: `User Id`, validator: (arg: any) => numberValidator(arg) && parseInt(arg) > 0, errorMessage: `is required` },
  { field: `writer_id`, name: `Writer Id`, validator: (arg: any) => numberValidator(arg) && parseInt(arg) > 0, errorMessage: `is required` },
  { field: `rating`, name: `Rating`, validator: (arg: any) => numberValidator(arg) && VALID_RATINGS.has(parseInt(arg)), errorMessage: `must be 1-5` },
  { field: `title`, name: `Title`, validator: genericTextValidator, errorMessage: `must be: at least 3 characters, alphanumeric, dashes, underscores, periods, etc` },
  { field: `summary`, name: `Summary`, validator: genericTextValidator, errorMessage: `must be: at least 3 characters, alphanumeric, dashes, underscores, periods, etc` },
];




export const convertModel = <T> (model: IMyModel | Model | null) => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModels = <T> (models: (IMyModel | Model)[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}

export const convertModelCurry = <T> () => (model: IMyModel | Model | null) => {
  return model ? (<any> model.toJSON()) as T : null;
}

export const convertModelsCurry = <T> () => (models: (IMyModel | Model)[]) => {
  return models.map((model) => (<any> model.toJSON()) as T);
}



export function AuthorizeJWT(
  request: Request,
  checkUrlYouIdMatch: boolean = true,
  secret?: string,
): {
  error: boolean;
  status: HttpStatusCode;
  message: string;
  you?: UserEntity;
} {
  try {
    /* First, check Authorization header */
    const auth = request.get('Authorization');
    if (!auth) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: missing Authorization header`
      };
    }
    const isNotBearerFormat = !(/Bearer\s[^]/).test(auth);
    if (isNotBearerFormat) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: Authorization header must be Bearer format`
      };
    }

    /* Check token validity */
    const token = auth.split(' ')[1];
    let you;
    try {
      you = decodeJWT(token, secret) || null;
    } catch (e) {
      console.log(e);
      you = null;
    }
    if (!you) {
      return {
        error: true,
        status: HttpStatusCode.UNAUTHORIZED,
        message: `Request not authorized: invalid token`
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
          message: `Request not authorized: You are not permitted to complete this action`
        };
      }
    }

    /* Request is okay */
    return {
      error: false,
      status: HttpStatusCode.OK,
      message: `user authorized`,
      you: (<UserEntity> you),
    };
  } catch (error) {
    console.log(`auth jwt error:`, error);
    return {
      error: true,
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: `Request auth failed...`
    };
  }
}



export const validateData = (options: {
  data: any,
  validators: IModelValidator[],
  mutateObj?: any
}): ServiceMethodResults => {
  const { data, validators, mutateObj } = options;
  const dataObj: any = {};

  for (const prop of validators) {
    if (!data.hasOwnProperty(prop.field)) {
      if (prop.optional) {
        if (prop.defaultValue) {
          dataObj[prop.field] = prop.defaultValue;
        }
        continue;
      }

      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `${prop.name} is required.`
        }
      };
      return serviceMethodResults;
    }
    const isValid: boolean = prop.validator(data[prop.field]);
    if (!isValid) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: prop.errorMessage ? `${prop.name} ${prop.errorMessage}` : `${prop.name} is invalid.`
        }
      };
      return serviceMethodResults;
    }
    
    dataObj[prop.field] = data[prop.field];
  }

  if (mutateObj) {
    Object.assign(mutateObj, dataObj);
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message: `validation passed.`,
      data: dataObj,
    }
  };
  return serviceMethodResults;
}

export async function isImageFileOrBase64(file: string | UploadedFile | undefined,) {
  if (typeof file === 'string') {
    const fileBuffer = decodeBase64(file);
    const isInvalidType = !allowedImages.includes(fileBuffer.file_type.split('/')[1]);
    return isInvalidType;
  }
  else {
    const isInvalidType = !allowedImages.includes((<UploadedFile> file).mimetype.split('/')[1]);
    return isInvalidType;
  }
}

export const validateImageFile = async (
  image_file: string | UploadedFile | undefined,
  options?: {
    treatNotFoundAsError: boolean,
  }
): ServiceMethodAsyncResults => {
  if (!image_file) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: options && options.hasOwnProperty('treatNotFoundAsError') ? options.treatNotFoundAsError : true,
      info: {
        message: `No image file found/given`
      }
    };
    return serviceMethodResults;
  }

  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message: `Image file found/given`
    }
  };
  return serviceMethodResults;
}



export const create_model_crud_repo_from_model_class = <T> (givenModelClass: MyModelStatic) => {
  // console.log({ givenModelClass });
  if (!givenModelClass) {
    throw new Error(`Model is required...`);
  }

  const convertTypeCurry = convertModelCurry<T>();
  const convertTypeListCurry = convertModelsCurry<T>();
  const modelClass = givenModelClass as MyModelStatic;

  const create = (createObj: any, createOptions?: CreateOptions) => {
    return modelClass.create(createObj, createOptions).then(convertTypeCurry);
  };

  const count = (findOptions: FindOptions) => {
    return modelClass.count(findOptions);
  };



  const findOne = (findOptions: FindOptions) => {
    return modelClass.findOne(findOptions).then(convertTypeCurry);
  };
  const findById = (id: number, findOptions?: FindOptions) => {
    const useWhere = findOptions
      ? { ...findOptions, where: { id } }
      : { where: { id } };
    return modelClass.findOne(useWhere).then(convertTypeCurry);
  };
  const findAll = (findOptions: FindOptions) => {
    return modelClass.findAll(findOptions).then(convertTypeListCurry);
  };



  const update = (updateObj: any, options: UpdateOptions) => {
    return modelClass.update(updateObj, { ...options, returning: true })
      .then((updates) => ({ rows: updates[0], models: updates[1].map(convertTypeCurry) }));
  };
  const updateById = (id: number, updateObj: any) => {
    return modelClass.update(updateObj, { where: { id }, returning: true })
      .then((updates) => ({ rows: updates[0], model: updates[1][0] && convertTypeCurry(updates[1][0]) }));
    // .then(async (updates) => {
    //   const fresh = await findById(id);
    //   // return updates;
    //   const returnValue = [updates[0], fresh] as [number, (T|null)];
    //   return returnValue;
    // });
  };



  const deleteFn = async (destroyOptions: DestroyOptions) => {
    const results = await modelClass.destroy(destroyOptions);
    const models = !destroyOptions.where ? [] : await modelClass.findAll({ where: destroyOptions.where, paranoid: false }).then(convertTypeListCurry);
    return { results, models };
  };
  const deleteById = async (id: number) => {
    const results = await modelClass.destroy({ where: { id } });
    const model = await modelClass.findOne({ where: { id }, paranoid: false }).then(convertTypeCurry);
    return { results, model };
  };


  const paginate = (params: IPaginateModelsOptions) => {
    return paginateTable(modelClass, params).then(convertTypeListCurry);
  };

  const randomModels = (params: IRandomModelsOptions) => {
    return getRandomModels<T>(modelClass, params).then(convertTypeListCurry);
  };

  

  return {
    create,
  
    findOne,
    findAll,
    findById,
    count,

    update,
    updateById,

    destroy: deleteFn,
    delete: deleteFn,
    deleteById,

    paginate,
    randomModels,
  };

};



export const sequelize_model_class_crud_to_entity_class = <T> (givenModelClass: MyModelStatic) => {
  // console.log({ givenModelClass });
  if (!givenModelClass) {
    throw new Error(`Model is required...`);
  }

  const convertTypeCurry = (model?: IMyModel) => {
    const data = !model ? null : model.toJSON() as T;
    // console.log(data);
    return data;
  };
  const convertTypeListCurry = (models: IMyModel[]) => models.map(convertTypeCurry);


  const modelClass = givenModelClass as MyModelStatic;

  const create = (createObj: any, createOptions?: CreateOptions) => {
    return modelClass.create(createObj, createOptions).then(convertTypeCurry);
  };

  const count = (findOptions: FindOptions) => {
    return modelClass.count(findOptions);
  };



  const findOne = (findOptions: FindOptions) => {
    return modelClass.findOne(findOptions).then(convertTypeCurry);
  };
  const findById = (id: number, findOptions?: FindOptions) => {
    const useWhere = findOptions
      ? { ...findOptions, where: { id } }
      : { where: { id } };
    return modelClass.findOne(useWhere).then(convertTypeCurry);
  };
  const findAll = (findOptions: FindOptions) => {
    return modelClass.findAll(findOptions).then(convertTypeListCurry);
  };



  const update = (updateObj: any, options: UpdateOptions) => {
    return modelClass.update(updateObj, { ...options, returning: true })
      .then((updates) => ({ rows: updates[0], models: updates[1].map(convertTypeCurry) }));
  };
  const updateById = (id: number, updateObj: any) => {
    return modelClass.update(updateObj, { where: { id }, returning: true })
      .then((updates) => ({ rows: updates[0], model: updates[1][0] && convertTypeCurry(updates[1][0]) }));
    // .then(async (updates) => {
    //   const fresh = await findById(id);
    //   // return updates;
    //   const returnValue = [updates[0], fresh] as [number, (T|null)];
    //   return returnValue;
    // });
  };



  const deleteFn = async (destroyOptions: DestroyOptions) => {
    const results = await modelClass.destroy(destroyOptions);
    const models = !destroyOptions.where ? [] : await modelClass.findAll({ where: destroyOptions.where, paranoid: false }).then(convertTypeListCurry);
    return { results, models };
  };
  const deleteById = async (id: number) => {
    const results = await modelClass.destroy({ where: { id } });
    const model = await modelClass.findOne({ where: { id }, paranoid: false }).then(convertTypeCurry);
    return { results, model };
  };


  const paginate = (params: IPaginateModelsOptions) => {
    return paginateTable(modelClass, params).then(convertTypeListCurry);
  };

  const randomModels = (params: IRandomModelsOptions) => {
    return getRandomModels<T>(modelClass, params).then(convertTypeListCurry);
  };

  const getAllModals = (params: {
    parent_id_field: string,
    parent_id: number,
    include?: Includeable[],
    attributes?: FindAttributeOptions,
    group?: GroupOption,
    whereClause?: WhereOptions,
    orderBy?: Order
  }) => {
    const {
      parent_id_field,
      parent_id,
      include,
      attributes,
      group,
      whereClause,
      orderBy
    } = params;
    return getAll(
      modelClass,
      parent_id_field,
      parent_id,
      include,
      attributes,
      group,
      whereClause,
      orderBy
    ).then(convertTypeListCurry);
  };

  

  return {
    create,
  
    findOne,
    findAll,
    findById,
    count,

    update,
    updateById,

    destroy: deleteFn,
    delete: deleteFn,
    deleteById,

    paginate,
    getAll: getAllModals,
    randomModels,
  };

};



export function get_distance_haversine_distance(params: {
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
}) {
  /*  
    https://developers.google.com/maps/documentation/distance-matrix/overview#DistanceMatrixRequests
    https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
  */
  var M = 3958.8; // Radius of the Earth in miles
  var K = 6371.0710; // Radius of the Earth in kilometers

  var rlat1 = params.from_lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = params.to_lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (params.to_lng - params.from_lng) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * M * Math.asin(
    Math.sqrt(
      Math.sin(difflat/2) * Math.sin(difflat/2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon/2) * Math.sin(difflon/2)
    )
  );
  return d;
}

export const ControllerServiceResultsHandler = <T> (results: ServiceMethodResults<T>) => {
  if (results.error) {
    throw new HttpException(results.info, results.status);
  }
  // return { ...results.info };
  return results.info;
}