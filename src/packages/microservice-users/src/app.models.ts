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
  UUIDV4,
  BuildOptions,
  Model,
  BIGINT,
  TEXT,
  NOW
} from 'sequelize';


const USERS_DATABASE_URL = process.env['DATABASE_URL'];

export const sequelize = new Sequelize(USERS_DATABASE_URL, {
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

export const Users = <MyModelStatic> sequelize.define('Users', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  bio:                    { type: STRING, allowNull: false, defaultValue: '' },
  displayname:            { type: STRING, allowNull: false, defaultValue: '' },
  username:               { type: STRING, allowNull: false, unique: true, defaultValue: UUIDV1 },
  email:                  { type: STRING, allowNull: false, unique: true },
  password:               { type: STRING, allowNull: false },
  profile_media_id:       { type: INTEGER, allowNull: false, defaultValue: 0 },
  phone:                  { type: STRING, allowNull: true, defaultValue: null },
  temp_phone:             { type: STRING, allowNull: true, defaultValue: null },
  date_of_birth:          { type: DATE, allowNull: true },
  town:                   { type: STRING, allowNull: true },
  city:                   { type: STRING, allowNull: true },
  state:                  { type: STRING, allowNull: true },
  zipcode:                { type: INTEGER, allowNull: true },
  country:                { type: STRING, allowNull: true },
  person_verified:        { type: BOOLEAN, allowNull: false, defaultValue: false },
  email_verified:         { type: BOOLEAN, allowNull: false, defaultValue: false },
  phone_verified:         { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const UserFields = <MyModelStatic> sequelize.define('UserFields', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:              { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  fieldname:            { type: STRING, allowNull: false, defaultValue: '' },
  fieldtype:            { type: STRING, allowNull: false, defaultValue: '' },
  fieldvalue:           { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const UserStripeIdentityVerificationSessions = <MyModelStatic> sequelize.define('UserStripeIdentityVerificationSessions', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },
  
  user_id:                            { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  verification_session_id:            { type: STRING, allowNull: false },
  expired:                            { type: BOOLEAN, allowNull: false, defaultValue: false },
  verified:                           { type: BOOLEAN, allowNull: false, defaultValue: false },
  status:                             { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const UsersEmailVerifications = <MyModelStatic> sequelize.define('UsersEmailVerifications', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:                 { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  email:                   { type: STRING, allowNull: true, defaultValue: '' },
  verification_code:       { type: STRING, unique: true, defaultValue: UUIDV4 },
  verified:                { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const UsersPhoneVerifications = <MyModelStatic> sequelize.define('UsersPhoneVerifications', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:                 { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  request_id:              { type: STRING, unique: true, allowNull: true },
  phone:                   { type: STRING, allowNull: true, defaultValue: '' },
  verification_code:       { type: STRING, allowNull: false },
}, common_model_options);

export const UserExpoDevices = <MyModelStatic> sequelize.define('UserExpoDevices', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:              { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  token:                { type: STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: JSON_TYPE, allowNull: true, defaultValue: null },
  device_id:            { type: STRING, allowNull: false, defaultValue: '' },
  device_type:          { type: STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);


export const UserDevices = <MyModelStatic> sequelize.define('UserDevices', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:              { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  token:                { type: STRING, allowNull: false, defaultValue: '' },
  device_info:          { type: JSON_TYPE, allowNull: true, defaultValue: null },
  device_id:            { type: STRING, allowNull: false, defaultValue: '' },
  device_type:          { type: STRING, allowNull: false, defaultValue: '' },
  device_platform:      { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const ResetPasswordRequests = <MyModelStatic> sequelize.define('ResetPasswordRequests', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:             { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  completed:           { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const ApiKeys = <MyModelStatic> sequelize.define('ApiKeys', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  user_id:             { type: INTEGER, allowNull: false, references: { model: Users, key: 'id' } },
  webhook_endpoint:    { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

export const ApiKeyRequests = <MyModelStatic> sequelize.define('ApiKeyRequests', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  api_key_id:          { type: INTEGER, allowNull: false, references: { model: ApiKeys, key: 'id' } },
  url:                 { type: STRING, allowNull: false, defaultValue: '' },
  method:              { type: STRING, allowNull: true, defaultValue: '' },
}, common_model_options);

export const ApiKeyWebhookEvents = <MyModelStatic> sequelize.define('ApiKeyWebhookEvents', {
  id:                     { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:                   { type: STRING, defaultValue: UUIDV1 },
  metadata:               { type: JSON_TYPE, allowNull: true },

  api_key_id:          { type: INTEGER, allowNull: false, references: { model: ApiKeys, key: 'id' } },
  event:               { type: STRING, allowNull: false },
  response_code:       { type: INTEGER, allowNull: false },
}, common_model_options);



/** Init Database */

const databaseReadyStream = new BehaviorSubject<boolean>(false);

const db_init = async () => {
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

export const storageReady = db_init();


export function onDatabaseReady() {
  return databaseReadyStream.asObservable().pipe(filter((state: boolean) => state === true));
}

export const USERS_DB_PROVIDER_TOKEN = `USERS_DB_PROVIDER-${Date.now()}`;

export const USERS_DB_PROVIDER: Provider = {
  provide: USERS_DB_PROVIDER_TOKEN, // the token is not needed because nothing will be injected
  useFactory: async () => {
    // the importing thing is connecting to the database before the app is ready
    await db_init();
    return sequelize;
  }
}
