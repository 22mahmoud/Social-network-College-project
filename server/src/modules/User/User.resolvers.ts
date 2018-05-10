import { validate } from "class-validator";
import { hashSync } from "bcrypt-nodejs";
import { getManager } from "typeorm";
import { createWriteStream } from "fs";
import * as mkdirp from "mkdirp";
import shortid from "shortid";

import User from "./User.entity";
import FriendRequest from "./FriendRequest.entity";

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
    me: async (_, __, ctx) => {
      if (!ctx.user) {
        return;
      }
      const me = await User.findOne(ctx.user.id);

      return me;
    },

    getProfile: async (_, { id }) => {
      try {
        const user = await User.findOne(id);
        if (!user) {
          throw new Error();
        }

        return user;
      } catch (error) {
        throw error;
      }
    },
    getMyFriendRequests: async (_, __, ctx) => {
      try {
        const friendRequets = await getManager()
          .createQueryBuilder(FriendRequest, "fq")
          .innerJoinAndSelect(
            "fq.sender",
            "sender",
            "fq.isAccepted = :isAccepted",
            { isAccepted: false }
          )
          .where("fq.receiver = :receiver", { receiver: ctx.user.id })
          .select(["fq.id", "sender.email"])
          .getMany();

        return friendRequets.map(fr => ({
          id: fr.id,
          senderEmail: fr.sender.email
        }));
      } catch (error) {
        console.error(error);
        return;
      }
    },
    getUser: async (_, { email }, ctx) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return {
            errors: {
              path: "user",
              message: "user not found!"
            }
          };
        }

        const [isFriendRequest] = await getManager().query(
          `SELECT *
          FROM friend_request AS fq
          WHERE ( fq.senderId = ? AND fq.receiverId = ? ) OR ( fq.senderId = ? AND fq.receiverId = ?  )
        `,
          [ctx.user.id, user.id, user.id, ctx.user.id]
        );

        if (!isFriendRequest) {
          return {
            ...user,
            notYet: true
          };
        }

        if (isFriendRequest.isAccepted === 1) {
          return {
            ...user,
            isFriend: true
          };
        }

        if (
          isFriendRequest.isAccepted === 0 &&
          isFriendRequest.senderId === ctx.user.id
        ) {
          return {
            ...user,
            youSent: true,
            friendRequestId: isFriendRequest.id
          };
        }

        if (
          isFriendRequest.isAccepted === 0 &&
          isFriendRequest.receiverId === ctx.user.id
        ) {
          return {
            ...user,
            heSent: true,
            friendRequestId: isFriendRequest.id
          };
        }

        return {
          ...user,
          notYet: true
        };
      } catch (error) {
        console.error(error);
        return;
      }
    },
    getMyFriends: async (_, __, ctx) => {
      try {
        /*
          Get My friend from Freind_request Table
        */
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

        return users;
      } catch (error) {
        console.error(error);
        return;
      }
    }
  },

  Mutation: {
    signup: async (_, { profilePicture, ...args }) => {
      try {
        const user = User.create({
          profilePicture: profilePicture
            ? await processUpload(profilePicture)
            : null,
          ...args
        });

        const errors = await validate(user);

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

        await user.save();
        return {
          isOk: true,
          token: user.createToken()
        };
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            isOk: false,
            errors: [
              {
                path: "email",
                message: `No user found for email: ${email}`
              }
            ]
          };
        }
        const passwordValid = user.authanticateUser(password);
        if (!passwordValid) {
          return {
            isOk: false,
            errors: [
              {
                path: "password",
                message: `Invalid password`
              }
            ]
          };
        }

        return {
          isOk: true,
          token: user.createToken()
        };
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },
    updateUserBasicInfo: async (_, args, ctx) => {
      try {
        const user = await User.findOne(args.id);
        if (!user) {
          return {
            isOk: false
          };
        }
        if (user.id !== ctx.user.id) {
          return {
            isOk: false
          };
        }

        Object.keys(args).forEach(key => (user[key] = args[key]));
        const errors = await validate(user);
        if (errors.some(e => e.property !== "email")) {
          if (errors.length > 0) {
            const formatedErrors: ErrorInterface[] = [];
            errors.map(error => {
              if (error.property !== "email") {
                formatedErrors.push({
                  path: error.property,
                  message: Object.values(error.constraints)[0]
                });
              }
            });
            return {
              isOk: false,
              errors: formatedErrors
            };
          }
        }

        await user.save();
        return {
          isOk: true,
          user
        };
      } catch (error) {
        return {
          isOk: false
        };
      }
    },
    updateUserPassword: async (_, { newPassword, oldPassword, id }, ctx) => {
      try {
        const user = await User.findOne(id);
        if (!user) {
          return {
            isOk: false
          };
        }
        if (user.id !== ctx.user.id) {
          return {
            isOk: false
          };
        }

        if (!user.authanticateUser(oldPassword)) {
          return {
            isOk: false,
            errors: [
              {
                path: "old password",
                message: "You entered wrong password "
              }
            ]
          };
        }

        if (newPassword.length < 6) {
          return {
            isOk: false,
            errors: [
              {
                path: "new password",
                message: "password must be longer than or equal to 5 characters"
              }
            ]
          };
        }

        user.password = hashSync(newPassword);
        await user.save();
        return {
          isOk: true,
          user
        };
      } catch (error) {
        console.error(error);
        return {
          isOk: false
        };
      }
    },
    updateUserProfilePicture: async (_, { id, profilePicture }, ctx) => {
      if (!profilePicture) {
        return {
          isOk: false,
          errors: [
            {
              path: "profile Picture",
              message: "please choose a photo!"
            }
          ]
        };
      }
      const user = await User.findOne(id);
      if (!user) {
        return {
          isOk: false
        };
      }

      if (user.id !== ctx.user.id) {
        return {
          isOk: false
        };
      }

      user.profilePicture = await processUpload(profilePicture);
      await user.save();
      return {
        isOk: true,
        user
      };
    },
    sendFriendRequest: async (_, { userId }, ctx) => {
      try {
        if (ctx.user.id === userId) {
          throw new Error();
        }
        const userToSend = await User.findOne({ id: userId });
        if (!userToSend) {
          throw new Error();
        }

        const [isExist] = await getManager().query(
          `SELECT *
            FROM friend_request AS fq
            WHERE ( fq.senderId = ? AND fq.receiverId = ? ) OR ( fq.senderId = ? AND fq.receiverId = ?  )
          `,
          [ctx.user.id, userId, userId, ctx.user.id]
        );

        if (isExist) {
          throw new Error();
        }

        const friendRequest = FriendRequest.create({
          receiver: userToSend,
          sender: ctx.user
        });
        await friendRequest.save();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    acceptFriendRequest: async (_, { friendRequestId }, ctx) => {
      try {
        const friendRequest = await getManager()
          .createQueryBuilder(FriendRequest, "fq")
          .where("fq.id = :id", { id: friendRequestId })
          .andWhere("fq.receiver = :receiver", { receiver: ctx.user.id })
          .getOne();

        if (!friendRequest) {
          throw new Error();
        }

        friendRequest.isAccepted = true;
        await friendRequest.save();

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};
