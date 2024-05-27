export interface CreateUser {
  email: string,
  password: string,
}

export interface LoginUser {
  email_or_username: string,
  password: string,
}

export interface UpdateUser {
  metadata?: string | null,
  bio?: string,
  displayname?: string,
  username?: string,
  profile_media_id?: number,
  date_of_birth?: string | null,
  town?: string | null,
  city?: string | null,
  state?: string | null,
  zipcode?: number | null,
  country?: string | null,
}