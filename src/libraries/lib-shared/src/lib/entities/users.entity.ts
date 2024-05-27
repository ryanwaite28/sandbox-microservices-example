import { BaseEntity } from "./_base.entity";

export interface UserEntity extends BaseEntity {
  bio: string,
  displayname: string,
  username: string,
  email: string,
  password: string,
  profile_media_id: number,
  phone: string | null,
  temp_phone: string | null,
  date_of_birth: string | null,
  town: string | null,
  city: string | null,
  state: string | null,
  zipcode: number | null,
  country: string | null,
  person_verified: boolean,
  email_verified: boolean,
  phone_verified: boolean,
}

export interface UsersEmailVerificationEntity extends BaseEntity {
  user_id: number;
  email: string | null;
  verification_code: string;
  verified: boolean;
  date_created: string;
  uuid: string;
}

export interface UsersPhoneVerificationEntity extends BaseEntity {
  user_id: number;
  request_id: string | null;
  phone: string | null;
  verification_code: string;
  date_created: string;
  uuid: string;
}