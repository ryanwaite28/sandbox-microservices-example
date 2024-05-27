import { ArrayMinSize } from "class-validator";





export class QueryUsersDto {
  @ArrayMinSize(1)
  where: Partial<{
    sex: string,
    gender: string,
    username: string,
    displayname: string,
    email: string,
    phone: string,
    is_public: boolean,
    person_verified: boolean,
    phone_verified: boolean,
    deactivated: boolean,
  }>[];

  limit: number;
}
