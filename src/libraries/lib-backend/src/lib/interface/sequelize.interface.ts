import {
  BuildOptions,
} from 'sequelize';
import { Model } from 'sequelize';




/**
 * @see: https://sequelize.org/master/manual/typescript
 */


/** Model Class Type */

export interface IMyModel extends Model<any> {
  readonly id: number;
  [key: string]: any;
}

export type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IMyModel;
};

export type MyModelStaticGeneric<T> = typeof Model & {
  new (values?: object, options?: BuildOptions): T;
};

export interface IUploadFile {
  error: boolean;
  filename?: string;
  file_path?: string;
  message?: string;
  filetype: string;
}



// export interface IModelRating extends ICommonModel {
//   user_id:             number,
//   writer_id:           number,
//   rating:              number,
//   title:               string,
//   summary:             string,
// }