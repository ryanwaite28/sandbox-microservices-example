import { NAME_REGEX, USERNAME_REGEX, PASSWORD_REGEX, DISPLAYNAME_REGEX, UpdateUser, CreateUser, LoginUser } from '@app/lib-shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';



export class CreateUserDto implements CreateUser {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  confirmPassword: string;
}


export class LoginUserDto implements LoginUser {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email_or_username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}


export class ResetPasswordRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}



export class UpdateUserDto implements UpdateUser {  
  @ApiProperty()
  @IsOptional()
  @Matches(USERNAME_REGEX)
  username: string;

  @ApiProperty()
  @IsOptional()
  @Matches(DISPLAYNAME_REGEX)
  displayname?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  profile_media_id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  metadata?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  date_of_birth?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  town?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string | null;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  zipcode?: number | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string | null;
}


export class UserPasswordUpdateDto {
  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  @IsNotEmpty()
  confirmPassword: string;
}



export class RegisterExpoTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expo_token: string;
}
