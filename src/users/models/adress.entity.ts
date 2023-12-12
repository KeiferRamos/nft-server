import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  street: string;

  @Column()
  @Field()
  barangay: string;

  @Column()
  @Field()
  city: string;

  @Column()
  @Field()
  block_no: number;

  @Column()
  @Field()
  province: string;

  @Column()
  @Field()
  country: string;

  @OneToOne(() => User, (user) => user.address, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
