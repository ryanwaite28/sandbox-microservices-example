import { Provider } from '@nestjs/common';
import { BehaviorSubject, filter } from 'rxjs';
import {
  Sequelize,
  STRING,
  BOOLEAN,
  SyncOptions,
  DATE,
  INTEGER,
  JSON as JSON_TYPE,
  UUIDV1,
  BuildOptions,
  Model,
  BIGINT
} from 'sequelize';


const STORAGE_DATABASE_URL = process.env['DATABASE_URL'];

export const sequelize = new Sequelize(STORAGE_DATABASE_URL, {
  logging: true,
  dialect: 'postgres',
  query: {
    raw: true,
  },
  dialectOptions: {
    // ssl: {
    //   require: false,
    //   rejectUnauthorized: false
    // }
  }
});

const common_model_options = {
  sequelize,
  paranoid: true,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};



/** Models */

export interface IMyModel extends Model<any> {
  readonly id: number;
  [key: string]: any;
}

export type MyModelStatic <T = any> = typeof Model<any> & {
  new (values?: object, options?: BuildOptions): IMyModel & T;
};

export const MediaObjects = <MyModelStatic> sequelize.define('MediaObjects', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },
  
  owner_id:               { type: INTEGER, allowNull: true },
  extension:              { type: STRING, allowNull: false },
  type:                   { type: STRING, allowNull: false },
  size:                   { type: BIGINT, allowNull: false },
  chunks:                 { type: INTEGER, allowNull: true },
  version:                { type: INTEGER, allowNull: false },
  key:                    { type: STRING, allowNull: false },
  path:                   { type: STRING, allowNull: false },
  domain:                 { type: STRING, allowNull: false },
  url:                    { type: STRING, allowNull: false },
  status:                 { type: STRING, allowNull: false },
}, common_model_options);



/** Init Database */

const databaseReadyStream = new BehaviorSubject<boolean>(false);

const storage_db_init = async () => {
  const sequelize_db_sync_options: SyncOptions = {
    force: false,
    alter: false,
  };
  
  console.log({
    sequelize_db_sync_options,
  });

  // await sequelize.drop();

  return sequelize.sync(sequelize_db_sync_options)
    .then(() => {
      console.log('\n\nDatabase Initialized!');
      databaseReadyStream.next(true);
    })
    .catch((error) => {
      console.log('\n\nDatabase Failed!', error);
      throw error;
    });
};


export function onDatabaseReady() {
  return databaseReadyStream.asObservable().pipe(filter((state: boolean) => state === true));
}

export const STORAGE_DB_PROVIDER_TOKEN = `STORAGE_DB_PROVIDER-${Date.now()}`;

export const STORAGE_DB_PROVIDER: Provider = {
  provide: STORAGE_DB_PROVIDER_TOKEN, // the token is not needed because nothing will be injected
  useFactory: async () => {
    // the importing thing is connecting to the database before the app is ready
    await storage_db_init();
    return sequelize;
  }
}
