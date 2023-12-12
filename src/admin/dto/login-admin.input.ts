import { CreateAdminInput } from './create-admin.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class LoginAdminInput extends PickType(CreateAdminInput, [
  'username',
  'password',
]) {}
