import { Field, Float, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Categories, Order } from 'src/enums/enums';

@InputType()
export class createNftInputType {
  @Field()
  @IsString()
  image: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsEnum(Categories)
  category: string;

  @Field()
  @IsNumber()
  price: number;
}

@InputType()
export class createOrUpdateCommentInputType {
  @Field()
  @IsString()
  message: string;

  @Field()
  @IsString()
  ref_id: string;
}

@InputType()
export class queryInputType {
  @Field(() => Float, { nullable: true })
  @IsOptional()
  limit?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  skip?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  keyword?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  order?: string;
}

@InputType()
export class commentInputType extends queryInputType {
  @Field()
  @IsString()
  id: string;
}

@InputType()
export class updateNftInput extends PartialType(createNftInputType) {
  @Field()
  @IsString()
  id: string;
}
