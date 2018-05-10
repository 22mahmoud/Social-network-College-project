import { validate } from "class-validator";
import { hashSync } from "bcrypt-nodejs";
import { getManager } from "typeorm";

import User from "./User.entity";
import processUpload from "../../utils/uploadFiles";
import FormatErrors from "../../helpers/FormatErrors";

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
          return {
            isOk: false,
            errors: FormatErrors(errors)
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
        const errors = await validate(args);

        if (errors.length > 0) {
          return {
            isOk: false,
            errors: FormatErrors(errors)
          };
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
    }
  }
};
