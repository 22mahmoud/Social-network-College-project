import { getManager } from "typeorm";
import { createWriteStream } from "fs";
import * as mkdirp from "mkdirp";
import shortid from "shortid";

import { Post } from "../../models/entity/Post";
const uploadDir = "./public";
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }): Promise<any> => {
  const id = shortid.generate();
  const path = `${uploadDir}/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path }))
      .on("error", reject)
  );
};

const processUpload = async upload => {
  const { stream, filename } = await upload;
  const { path } = await storeUpload({ stream, filename });

  return path;
};

export default {
  Query: {
    getUserPosts: async (_, { userId }) => {
      try {
        const posts = await getManager()
          .createQueryBuilder(Post, "post")
          .select()
          .where("post.user = :user", { user: userId })
          .getMany();

        return posts;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    // u.id as user_id, u.firstName, u.lastName,
    //     p.id as post_id, p.imageUrl, p.caption, p.createdAt
    // INNER JOIN post p ON p.userId = u.id ORDER BY p.createdAt DESC
    getMyFriendsPosts: async (_, __, ctx) => {
      const posts = await getManager().query(
        `SELECT u.id as user_id, u.firstName, u.lastName,
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
        createdAt: post.createdAt,
        likesCount: post.likesCount,
        user: {
          id: post.user_id,
          firstName: post.firstName,
          lastName: post.lastName
        }
      }));
    }
  },
  Mutation: {
    createPost: async (_, { caption, image }, ctx) => {
      try {
        const imageUrl = await processUpload(image);
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
