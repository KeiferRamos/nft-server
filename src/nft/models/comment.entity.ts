import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Nft } from './nft.entity';

@ObjectType()
@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  comment: string;

  @Column()
  @Field()
  userId: string;

  @Column()
  @Field()
  username: string;

  @ManyToOne(() => Nft, (nft) => nft.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  nft: Nft;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@ObjectType()
export class CommentWithTotal {
  @Field()
  totalPages: number;

  @Field(() => [Comment])
  comments: Comment[];
}
