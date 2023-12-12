import { InputType, PartialType } from '@nestjs/graphql';
import { createUserInputType } from './create.user.dto';

@InputType()
export class updateUserInputType extends PartialType(createUserInputType) {}
