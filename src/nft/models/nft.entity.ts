import { Field, ObjectType } from '@nestjs/graphql';
import { Status } from 'src/enums/enums';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/users/models/user.entity';

@Entity()
@ObjectType()
export class Nft {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field()
  image: string;

  @Column({ unique: true })
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  category: string;

  @Column()
  @Field()
  price: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.nfts)
  @JoinColumn()
  @Field(() => User)
  owner: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.SELLING,
  })
  @Field()
  status: string;

  @OneToMany(() => Comment, (comment) => comment.nft)
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];
}

@ObjectType()
export class DataWithTotal {
  @Field()
  totalPages: number;

  @Field(() => [Nft])
  nfts: Nft[];
}
