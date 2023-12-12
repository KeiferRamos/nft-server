import { Field, ObjectType } from '@nestjs/graphql';
import { Gender } from 'src/enums/enums';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './adress.entity';
import { Message } from './message.entity';
import { Nft } from 'src/nft/models/nft.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => String!)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  first_name: string;

  @Column()
  password: string;

  @Column()
  balance: number;

  @Field()
  @Column()
  last_name: string;

  @Field()
  @Column()
  about_me: string;

  @Field()
  @Column()
  birth_date: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: string;

  @OneToMany(() => Message, (message) => message.user)
  @Field(() => [Message], { nullable: true })
  messages: Message[];

  @OneToOne(() => Address, (address) => address.user)
  @Field(() => Address, { nullable: true })
  address: Address;

  @OneToMany(() => Nft, (nft) => nft.owner)
  @Field(() => [Nft], { nullable: true })
  nfts: Nft[];

  @DeleteDateColumn()
  deletedAt?: Date;
}

@ObjectType()
export class Token {
  @Field()
  access_token: string;
}

@ObjectType()
export class Balance {
  @Field()
  balance: string;
}
