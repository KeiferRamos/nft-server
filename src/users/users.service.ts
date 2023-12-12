import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createUserInputType } from './dto/create.user.dto';
import { loginUserInputType } from './dto/login.use.dto';
import { JwtService } from '@nestjs/jwt';
import { updateUserInputType } from './dto/update.user.dto';
import { NftService } from 'src/nft/nft.service';
import { Status, Type } from 'src/enums/enums';
import { Address } from './models/adress.entity';
import { Message } from './models/message.entity';
import { Nft } from 'src/nft/models/nft.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Nft) private nftRepository: Repository<Nft>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => NftService))
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  extractToken(authorization): any {
    const [type, token] = authorization?.split(' ') ?? [];
    return this.jwtService.decode(token);
  }

  async create({ address, ...body }: createUserInputType) {
    try {
      const isInvalidUsername = await this.userRepository.findOneBy({
        username: body.username,
      });

      if (isInvalidUsername) {
        throw new BadRequestException('Username already in used!');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, salt);
      const user = this.userRepository.create({
        ...body,
        balance: 1000,
        password: hashedPassword,
      });
      const userAddress = this.addressRepository.create(address);

      await this.userRepository.save(user);
      userAddress.user = user;

      await this.addressRepository.save(userAddress);

      return 'successfully register';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login({ username, password }: loginUserInputType) {
    const isValidUser = await this.userRepository.findOneBy({ username });

    if (!isValidUser) {
      throw new BadRequestException('Incorrect username or password');
    }
    const verifyPassword = await bcrypt.compare(password, isValidUser.password);

    if (!verifyPassword) {
      throw new BadRequestException('Incorrect username or password');
    }

    return {
      access_token: this.jwtService.sign(
        {
          id: isValidUser.id,
        },
        { expiresIn: '8h' },
      ),
    };
  }

  async updateProfile(
    token: string,
    { address, ...input }: updateUserInputType,
  ) {
    const { id } = this.extractToken(token);

    await this.userRepository.update(
      {
        id,
      },
      {
        ...input,
      },
    );

    return 'updated successfully!';
  }

  findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['address', 'messages', 'nfts'],
    });
  }

  async viewUser(id: string, context) {
    try {
      const token = context.req.headers.authorization;
      const { id: userId } = this.extractToken(token);
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new UnauthorizedException();
      }

      return this.userRepository.findOne({
        where: { id },
        relations: ['address', user.id === id && 'messages', 'nfts'].filter(
          Boolean,
        ),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async marketNft(id: string, context) {
    try {
      const token = context.req.headers.authorization;
      const { id: userId } = this.extractToken(token);
      const user = await this.userRepository.findOneBy({ id: userId });
      const nft = await this.nftRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
      if (nft.owner.id !== user.id) {
        throw new BadRequestException('you are not the owner');
      }

      if (nft.status !== Status.PURCHASED) {
        throw new BadRequestException('Unable to market nft');
      }

      await this.nftRepository.update(
        { id: nft.id },
        { status: Status.SELLING },
      );

      return 'market successfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkBalance(token: string) {
    try {
      const { id } = this.extractToken(token);
      const user = await this.userRepository.findOneBy({ id });
      if (user) {
        return user.balance;
      }

      throw new BadRequestException('Unauthorized');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sellNft(id: string, context) {
    try {
      const token = context.req.headers.authorization;
      const { id: userId } = this.extractToken(token);

      const message = await this.messageRepository.findOneBy({ id });

      const nft = await this.nftRepository.findOne({
        where: {
          id: message.ref_id,
        },
        relations: ['owner'],
      });

      if (userId !== nft.owner.id || nft.status !== Status.PENDING) {
        throw new BadRequestException('Unable to sell');
      }

      const buyer = await this.userRepository.findOneBy({
        username: message.message.split(' - ')[0],
      });

      const seller = await this.userRepository.findOneBy({ id: userId });

      await this.userRepository.update(
        {
          id: seller.id,
        },
        {
          balance: seller.balance + nft.price,
        },
      );

      await this.messageRepository.softDelete({ id: message.id });

      const buyerMessage = this.messageRepository.create({
        type: Type.SOLD,
        ref_id: nft.id,
        message: `${seller.username} sold ${nft.title} to you`,
      });

      buyerMessage.user = buyer;
      await this.messageRepository.save(buyerMessage);

      await this.userRepository.update(
        {
          id: buyer.id,
        },
        {
          balance: buyer.balance - nft.price,
        },
      );

      await this.nftRepository.update(
        { id: nft.id },
        {
          status: Status.PURCHASED,
          owner: buyer,
        },
      );

      return 'You successfully sold your nft to' + buyer.username;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async buyNft(id: string, context) {
    const nft = await this.nftRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!nft || nft.status !== Status.SELLING) {
      return 'this nft is no longer available';
    }

    const token = context.req.headers.authorization;

    const user = await this.findById(this.extractToken(token).id);
    const owner = await this.userRepository.findOneBy({ id: nft.owner.id });

    if (!owner) {
      throw new BadRequestException('owner is no longer available');
    }

    if (user.id === nft.owner.id) {
      throw new BadRequestException(
        'this is your own nft, what are you doing?',
      );
    }

    if (user.balance < nft.price) {
      throw new BadRequestException('not enough balance');
    }

    const message = this.messageRepository.create({
      message: `${user.username} - wants to purchase - ${nft.title}`,
      type: Type.PURCHASING,
      ref_id: nft.id,
    });

    message.user = owner;

    await this.messageRepository.save(message);

    await this.nftRepository.update(
      { id: nft.id },
      {
        status: Status.PENDING,
      },
    );

    return 'Your purchase is being process now. Thank you!';
  }

  async deleteOne(id: string) {
    await this.userRepository.softDelete({ id });
    return 'user deleted successfully';
  }

  async restoreOne(id: string) {
    await this.userRepository.restore({ id });

    return 'User restored successfully';
  }

  async deleteAll() {
    await this.userRepository.softDelete({});
    return 'all content deleted successfully';
  }

  async findAll() {
    try {
      return this.userRepository.find({
        relations: ['address', 'nfts'].filter(Boolean),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
