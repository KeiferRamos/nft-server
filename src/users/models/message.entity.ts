import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Type } from 'src/enums/enums';

@ObjectType()
@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  message: string;

  @Column()
  @Field()
  ref_id: string;

  @Column({
    type: 'enum',
    enum: Type,
    default: Type.PURCHASING,
  })
  @Field()
  type: string;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
