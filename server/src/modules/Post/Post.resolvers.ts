import { getManager } from "typeorm";
import { createWriteStream } from "fs";
import * as mkdirp from "mkdirp";
import shortid from "shortid";

import { validate } from "class-validator";
import Post from "./Post.entity";
const uploadDir = "./public";
mkdirp.sync(uploadDir);

interface ErrorInterface {
  path: string;
  message: string;
}

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
    getPost: async (_, { postId }, ctx) => {
      try {
        const [post] = await getManager().query(
          `
            SELECT  u.id as user_id, u.firstName, u.lastName, u.nickName, u.profilePicture,
            p.id as post_id, p.imageUrl, p.caption, p.createdAt, p.imageUrl
            FROM post as p
            INNER JOIN user AS u ON u.id = p.userId 
            WHERE p.id = ?
          `,
          [postId]
        );

        if (!post) {
          return {
            isOk: false,
            errors: [{ path: "post", message: "post not found" }]
          };
        }

        if (post.user_id === ctx.user.id) {
          return {
            isOk: true,
            post: {
              id: post.post_id,
              caption: post.caption,
              createdAt: post.createdAt,
              likesCount: post.likesCount,
              imageUrl: post.imageUrl,
              user: {
                id: post.user_id,
                firstName: post.firstName,
                lastName: post.lastName,
                profilePicture: post.profilePicture,
                nickName: post.nickName
              }
            }
          };
        }

        const myFriends = await getManager().query(
          `SELECT u.id AS user_id
          FROM user u
          INNER JOIN 
          (
          SELECT fq.senderId as sender_id, fq.receiverId as receiver_id
          FROM friend_request AS fq
          WHERE (fq.senderId = ? OR fq.receiverId = ?) AND (fq.isAccepted = true)
          ) a ON u.id <> ? AND (u.id = a.sender_id OR u.id = a.receiver_id) 
          `,
          [ctx.user.id, ctx.user.id, ctx.user.id]
        );

        if (!myFriends.some(friend => friend.id === post.userId)) {
          return {
            isOk: false,
            errors: [{ path: "post", message: "post not found" }]
          };
        }

        return {
          isOk: true,
          post: {
            id: post.post_id,
            caption: post.caption,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            user: {
              id: post.user_id,
              firstName: post.firstName,
              lastName: post.lastName,
              profilePicture: post.profilePicture,
              nickName: post.nickName
            }
          }
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
        const posts = await getManager().query(
          `
          SELECT  u.id as user_id,  u.nickName, u.profilePicture,
          p.id as post_id, p.imageUrl, p.caption, p.createdAt
          FROM post as p
          INNER JOIN user AS u ON u.id = p.userId
          WHERE u.id = ?
        `,
          userId
        );

        if (userId === ctx.user.id) {
          return posts.map(post => ({
            isOk: true,
            post: {
              id: post.post_id,
              caption: post.caption,
              createdAt: post.createdAt,
              likesCount: post.likesCount,
              imageUrl: post.imageUrl,
              user: {
                id: post.user_id,
                profilePicture: post.profilePicture,
                nickName: post.nickName
              }
            }
          }));
        }

        const users = await getManager().query(
          `SELECT *
          FROM user u
          INNER JOIN 
          (
            SELECT fq.senderId as sender_id, fq.receiverId as receiver_id
            FROM friend_request AS fq
            WHERE (fq.senderId = ? OR fq.receiverId = ?) AND (fq.isAccepted = true)
          ) a ON u.id <> ? AND (u.id = a.sender_id OR u.id = a.receiver_id) 
          `,
          [ctx.user.id, ctx.user.id, ctx.user.id]
        );

        if (!users.some(user => user.id === userId)) {
          return [
            {
              isOk: false,
              errors: [{ path: "posts", message: "posts not found" }]
            }
          ];
        }

        return posts.map(post => ({
          isOk: true,
          post: {
            id: post.post_id,
            caption: post.caption,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            imageUrl: post.imageUrl,
            user: {
              id: post.user_id,
              profilePicture: post.profilePicture,
              nickName: post.nickName
            }
          }
        }));
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },
    // u.id as user_id, u.firstName, u.lastName,
    //     p.id as post_id, p.imageUrl, p.caption, p.createdAt
    // INNER JOIN post p ON p.userId = u.id ORDER BY p.createdAt DESC
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

      console.log("====================================");
      console.log(posts);
      console.log("====================================");
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
          const formatedErrors: ErrorInterface[] = [];
          errors.forEach(error => {
            formatedErrors.push({
              path: error.property,
              message: Object.values(error.constraints)[0]
            });
          });

          return {
            isOk: false,
            errors: formatedErrors
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
