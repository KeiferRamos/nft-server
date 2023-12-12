import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Match, ValidateAdmin } from 'src/decorator/user.validation';

@InputType()
export class CreateAdminInput {
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
  @ValidateAdmin(process.env.ADMIN_PASS)
  admin_pass: string;
}
