import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsObject, IsString } from 'class-validator';
import { IsOnlyDate, Match } from 'src/decorator/user.validation';
import { Gender } from 'src/enums/enums';

@InputType()
export class AddressInputType {
  @IsString()
  @Field()
  street: string;

  @IsString()
  @Field()
  barangay: string;

  @IsString()
  @Field()
  city: string;

  @IsNumber()
  @Field()
  block_no: number;

  @IsString()
  @Field()
  province: string;

  @IsString()
  @Field()
  country: string;
}

@InputType()
export class createUserInputType {
  @Field()
  @IsString()
  first_name: string;

  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @Match('password')
  verify: string;

  @Field()
  @IsString()
  last_name: string;

  @Field()
  @IsString()
  about_me: string;

  @Field()
  @IsString()
  @IsOnlyDate()
  birth_date: string;

  @Field()
  @IsEnum(Gender)
  gender: string;

  @Field()
  @IsObject({ each: true })
  address: AddressInputType;
}
