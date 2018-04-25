import { User } from "../../models/entity/User";
import { validate } from "class-validator";
import { FriendRequest } from "../../models/entity/FriendRequest";
import { getManager } from "typeorm";

interface ErrorInterface {
  path: string;
  message: string;
}

export default {
  // User: {
  //   posts: async parent => {
  //     const posts = await getConnection().

  //   }
  // },

  Query: {
    me: async (_, __, ctx) => {
      if (!ctx.user) {
        return;
      }
      const me = await User.findOne(ctx.user.id);
      return me;
    },
    hello: _ => "Hell",
    getUser: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            isOk: false,
            errors: {
              path: "user",
              message: "user not found!"
            }
          };
        }

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
    }
  },

  Mutation: {
    signup: async (_, args) => {
      try {
        const user = User.create(args);
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
    sendFriendRequest: async (_, { userId }, ctx) => {
      try {
        if (ctx.user.id === userId) {
          throw new Error();
        }
        const userToSend = await User.findOne(userId);
        if (!userToSend) {
          throw new Error();
        }

        const isExist = await getManager().query(
          `SELECT *
            FROM friend_request AS fq
            WHERE ( fq.senderId = ? AND fq.receiverId = ? ) OR ( fq.senderId = ? AND fq.receiverId = ?  )
          `,
          [ctx.user.id, userId, userId, ctx.user.id]
        );

        if (isExist.length >= 1) {
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
