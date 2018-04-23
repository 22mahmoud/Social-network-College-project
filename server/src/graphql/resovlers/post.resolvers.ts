import { Post } from "../../models/entity/Post";
import { User } from "../../models/entity/User";
// import { User } from "../../models/entity/User";

export default {
  Mutation: {
    createPost: async (_, { userId, caption, imageUrl }) => {
      try {
        const user = await User.findOne(userId);
        const post = Post.create({ caption, imageUrl, user });

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
    }
  }
};
