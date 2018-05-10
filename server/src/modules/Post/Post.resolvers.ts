import { getManager } from "typeorm";
import { validate } from "class-validator";

import Post from "./Post.entity";

import processUpload from "../../utils/uploadFiles";
import FormatErrors from "../../helpers/FormatErrors";
import getMyFriendsList from "../../helpers/getMyFriends";

export default {
  Query: {
    getPost: async (_, { postId }, ctx) => {
      try {
        const post = await getManager()
          .createQueryBuilder(Post, "post")
          .innerJoinAndSelect("post.user", "user")
          .where("post.id = :id", { id: postId })
          .getOne();

        if (!post) {
          return {
            isOk: false,
            errors: [{ path: "post", message: "post not found" }]
          };
        }

        if (post.user.id === ctx.user.id) {
          return {
            isOk: true,
            post
          };
        }

        const myFriends = await getMyFriendsList(ctx.user.id);

        if (!myFriends.some(friend => friend.user === post.user.id)) {
          return {
            isOk: false,
            errors: [{ path: "post", message: "post not found" }]
          };
        }

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

    getUserPosts: async (_, { userId }, ctx) => {
      try {
        const posts = await getManager()
          .createQueryBuilder(Post, "post")
          .leftJoinAndSelect("post.user", "user")
          .where("user.id = :userId", { userId })
          .getMany();

        if (userId === ctx.user.id) {
          return posts.map(post => ({
            isOk: true,
            post
          }));
        }

        const myFriends = await getMyFriendsList(ctx.user.id);
        if (!myFriends.some(friend => friend.user === userId)) {
          return [
            {
              isOk: false,
              errors: [{ path: "posts", message: "posts not found" }]
            }
          ];
        }

        return posts.map(post => ({
          isOk: true,
          post
        }));
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },

    getMyFriendsPosts: async (_, __, ctx) => {
      const posts = await getManager().query(
        `SELECT u.id as user_id, u.profilePicture, u.nickName,
        p.id as post_id, p.imageUrl, p.caption, p.createdAt
        FROM user u
        INNER JOIN 
        (
        SELECT fq.senderId as sender_id, fq.receiverId as receiver_id
        FROM friend_request AS fq
        WHERE (fq.senderId = ? OR fq.receiverId = ?) AND (fq.isAccepted = true)
        ) a ON u.id <> ? AND (u.id = a.sender_id OR u.id = a.receiver_id) 
        INNER JOIN post p ON p.userId = u.id ORDER BY p.createdAt DESC 
        `,
        [ctx.user.id, ctx.user.id, ctx.user.id]
      );

      return posts.map(post => ({
        id: post.post_id,
        caption: post.caption,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        user: {
          id: post.user_id,
          nickName: post.nickName,
          profilePicture: post.profilePicture
        }
      }));
    }
  },

  Mutation: {
    createPost: async (_, { caption, image }, ctx) => {
      try {
        const post = Post.create({
          caption,
          imageUrl: image ? await processUpload(image) : null,
          user: ctx.user
        });

        const errors = await validate(post);
        if (errors.length > 0) {
          return {
            isOk: false,
            errors: FormatErrors(errors)
          };
        }

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
