import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft } from './models/nft.entity';
import { ILike, Like, Repository } from 'typeorm';
import {
  createOrUpdateCommentInputType,
  createNftInputType,
  queryInputType,
  commentInputType,
} from './dto/create.nft.dto';
import { UsersService } from 'src/users/users.service';
import { Comment } from './models/comment.entity';
import { Order } from 'src/enums/enums';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft) private readonly nftRepository: Repository<Nft>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(body: createNftInputType, context) {
    const { id } = this.userService.extractToken(
      context.req.headers.authorization,
    );

    const user = await this.userService.findById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    const nft = await this.nftRepository.findOneBy({ title: body.title });
    if (nft) {
      throw new BadRequestException('title already in used');
    }

    const data = this.nftRepository.create(body);
    data.owner = user;

    return this.nftRepository.save(data);
  }

  async addComment(
    { ref_id, message: comment }: createOrUpdateCommentInputType,
    context,
  ) {
    try {
      const user = await this.userService.findById(
        this.userService.extractToken(context.req.headers.authorization).id,
      );

      const nft = await this.nftRepository.findOneBy({ id: ref_id });

      const message = this.commentRepository.create({
        comment,
        userId: user.id,
        username: user.username,
      });

      message.nft = nft;
      await this.commentRepository.save(message);

      return 'comment added successfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateComment(
    context,
    { ref_id, message }: createOrUpdateCommentInputType,
  ) {
    try {
      const { id } = this.userService.extractToken(
        context.req.headers.authorization,
      );

      const comment = await this.commentRepository.findOneBy({ id: ref_id });

      if (comment.userId !== id) {
        throw new UnauthorizedException();
      }

      await this.commentRepository.update(
        {
          id: comment.id,
        },
        {
          comment: message,
        },
      );

      return 'comment updated successfully';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteComment(context, id: string) {
    try {
      const { id: userId } = this.userService.extractToken(
        context.req.headers.authorization,
      );

      const comment = await this.commentRepository.findOneBy({ id });
      if (comment.userId !== userId) {
        throw new UnauthorizedException();
      }

      await this.commentRepository.softDelete({ id });

      return 'comment successfully deleted';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async AllComments({ id, skip, limit, order, sortBy }: commentInputType) {
    const [comments, totalPages] = await this.commentRepository.findAndCount({
      relations: ['nft'],
      where: {
        nft: {
          id,
        },
      },
      skip: skip || 0,
      take: limit,
      order: {
        [sortBy || 'username']: order || Order.ASC,
      },
    });

    return {
      comments,
      totalPages,
    };
  }

  findById(id: string) {
    return this.nftRepository.findOneBy({ id });
  }

  async findAll() {
    const [nfts, totalPages] = await this.nftRepository.findAndCount({
      relations: ['comments', 'owner'],
    });

    return {
      nfts,
      totalPages,
    };
  }

  async filterNfts({ keyword, skip, limit, order, sortBy }: queryInputType) {
    try {
      const sorter = ['description', 'price', 'category'].includes(sortBy)
        ? sortBy
        : 'title';

      const queryString = keyword || '';
      const [nfts, totalPages] = await this.nftRepository.findAndCount({
        where: [
          {
            title: ILike(`%${queryString}%`),
          },
          {
            category: ILike(`%${queryString}%`),
          },
          {
            description: ILike(`%${queryString}%`),
          },
          {
            owner: {
              first_name: ILike(`%${queryString}%`),
            },
          },
          {
            owner: {
              last_name: ILike(`%${queryString}%`),
            },
          },
          {
            owner: {
              username: ILike(`%${queryString}%`),
            },
          },
        ],
        skip: skip || 0,
        take: limit,
        order: {
          [sorter]: order || Order.ASC,
        },
        relations: ['comments', 'owner'],
      });

      return {
        nfts,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, input: Partial<createNftInputType>) {
    await this.nftRepository.update(
      {
        id,
      },
      {
        ...input,
      },
    );

    return 'update successfully';
  }

  async delete(id: string, context) {
    const { id: userID } = this.userService.extractToken(
      context.req.headers.authorization,
    );

    const { affected } = await this.nftRepository.softDelete({
      id,
      owner: userID,
    });

    if (affected) {
      return 'nft successfully deleted';
    }

    throw new ForbiddenException();
  }

  async deleteAll() {
    await this.nftRepository.softDelete({});
    return 'all content deleted successfully';
  }
}
