import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class loginUserInputType {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}
