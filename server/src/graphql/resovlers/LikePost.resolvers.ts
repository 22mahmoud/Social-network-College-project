import { LikePost } from "../../models/entity/LikePost";
import { getManager } from "typeorm";

export default {
  Query: {
    getPostLikesCount: async (_, { postId }) => {
      try {
        const likesCount = await getManager()
          .createQueryBuilder(LikePost, "lp")
          .where("lp.post = :post", { post: postId })
          .getCount();

        return likesCount;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    isLike: async (_, { postId }, ctx) => {
      try {
        const likes = await getManager().query(
          `
          SELECT *
          FROM like_post AS lp
          WHERE lp.postId = ?
          `,
          [postId]
        );

        if (likes.some(elm => elm.userId === ctx.user.id)) {
          return true;
        }

        return false;
      } catch (error) {
        console.error(error);
        return;
      }
    }
  },
  Mutation: {
    likePostToggle: async (_, { postId }, ctx) => {
      try {
        const isExist = await LikePost.findOne({
          user: ctx.user.id,
          post: postId
        });
        if (isExist) {
          await isExist.remove();
          return {
            Liked: false
          };
        }

        await LikePost.create({
          user: ctx.user.id,
          post: postId
        }).save();
        return {
          Liked: true
        };
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};
