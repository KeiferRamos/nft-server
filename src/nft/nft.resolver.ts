import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DataWithTotal, Nft } from './models/nft.entity';
import {
  commentInputType,
  createNftInputType,
  createOrUpdateCommentInputType,
  queryInputType,
  updateNftInput,
} from './dto/create.nft.dto';
import { NftService } from './nft.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CommentWithTotal } from './models/comment.entity';
import { IsAdmin } from 'src/meta/data';

@Resolver(() => Nft)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Nft)
  createNft(
    @Args('createNftInputType') input: createNftInputType,
    @Context() context,
  ) {
    return this.nftService.create(input, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  updateNft(@Args('updateNftInput') { id, ...input }: updateNftInput) {
    return this.nftService.update(id, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  deleteNft(@Args('id') id: string, @Context() context) {
    return this.nftService.delete(id, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  addComment(
    @Args('createCommentInput') input: createOrUpdateCommentInputType,
    @Context() context,
  ) {
    return this.nftService.addComment(input, context);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  updateComment(
    @Args('createCommentInput') input: createOrUpdateCommentInputType,
    @Context() context,
  ) {
    return this.nftService.updateComment(context, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String)
  deleteComment(@Args('id') id: string, @Context() context) {
    return this.nftService.deleteComment(context, id);
  }

  @UseGuards(JwtAuthGuard)
  @IsAdmin()
  @Mutation(() => String)
  deleteAllNfts() {
    return this.nftService.deleteAll();
  }

  @Query(() => DataWithTotal)
  FilterNft(@Args('queryInput') query: queryInputType) {
    return this.nftService.filterNfts(query);
  }

  @Query(() => DataWithTotal)
  AllNft() {
    return this.nftService.findAll();
  }

  @Query(() => CommentWithTotal)
  AllComment(@Args('commentInput') query: commentInputType) {
    return this.nftService.AllComments(query);
  }
}
