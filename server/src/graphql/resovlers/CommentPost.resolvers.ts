import { Post } from "../../models/entity/Post";
import { CommentPost } from "../../models/entity/CommentPost";
import { getManager } from "typeorm";

export default {
  Query: {
    getPostComments: async (_, { postId }) => {
      try {
        const comments = await getManager()
          .createQueryBuilder(CommentPost, "cp")
          .leftJoinAndSelect("cp.user", "user")
          .where("cp.post = :post", { post: postId })
          .getMany();

        return comments;
      } catch (error) {
        throw error;
      }
    },
    getPostCommentsCount: async (_, { postId }) => {
      try {
        const commentsCount = await getManager()
          .createQueryBuilder(CommentPost, "cp")
          .where("cp.post = :postId", { postId })
          .getCount();
        return commentsCount;
      } catch (error) {
        throw error;
      }
    }
  },
  Mutation: {
    commentPost: async (_, { postId, content }, ctx) => {
      try {
        const isPostExist = await Post.findOne({ id: postId });

        if (!isPostExist) {
          throw new Error();
        }

        const post = await CommentPost.create({
          user: ctx.user.id,
          content,
          post: postId
        }).save();

        return {
          id: post.id,
          user: {
            id: ctx.user.id,
            firstName: ctx.user.firstName,
            lastName: ctx.user.lastName
          },
          content: post.content
        };
      } catch (error) {
        throw error;
      }
    }
  }
};
