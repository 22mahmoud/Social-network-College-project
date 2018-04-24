import { Post } from "../../models/entity/Post";
import { getManager } from "typeorm";

export default {
  Mutation: {
    createPost: async (_, { caption, imageUrl }, ctx) => {
      try {
        const post = Post.create({ caption, imageUrl, user: ctx.user });
        await post.save();
        return {
          isOk: true,
          post
        };
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },

    updatePost: async (_, { postId, ...args }, ctx) => {
      try {
        const post = await getManager()
          .createQueryBuilder(Post, "post")
          .innerJoinAndSelect("post.user", "user")
          .where("post.user = :user", { user: ctx.user.id })
          .andWhere("post.id = :id", { id: postId })
          .getOne();

        if (!post) {
          return {
            isOk: false,
            errors: [
              {
                path: "post",
                message: "something wrong happened"
              }
            ]
          };
        }

        Object.keys(args).forEach(key => (post[key] = args[key]));
        await post.save();
        return {
          isOk: true,
          post
        };
      } catch (error) {
        return {
          isOk: false
        };
      }
    },
    deletePost: async (_, { postId }, ctx) => {
      try {
        const post = await getManager()
          .createQueryBuilder(Post, "post")
          .innerJoinAndSelect("post.user", "user")
          .where("post.user = :user", { user: ctx.user.id })
          .andWhere("post.id = :id", { id: postId })
          .getOne();

        if (!post) {
          return {
            isOk: false,
            errors: [
              {
                path: "post",
                message: "something wrong happened"
              }
            ]
          };
        }

        await post.remove();
        return {
          isOk: true
        };
      } catch (error) {
        return {
          isOk: false
        };
      }
    }
  }
};
