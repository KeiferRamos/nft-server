import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  GAY = 'gay',
}

export enum Status {
  SELLING = 'selling',
  PENDING = 'pending',
  PURCHASED = 'purchased',
}

export enum Type {
  PURCHASING = 'purchasing',
  SOLD = 'sold',
}

export enum Order {
  DESC = 'desc',
  ASC = 'asc',
}

export enum Categories {
  ART = 'art',
  GAMING = 'gaming',
  COLLECTIBLE = 'collectible',
  DOMAIN = 'domain',
  VRS = 'virtual real estate',
}

registerEnumType(Order, {
  name: 'Order',
});

registerEnumType(Gender, {
  name: 'Gender',
});

registerEnumType(Status, {
  name: 'Status',
});
