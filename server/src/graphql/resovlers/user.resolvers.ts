import { User } from "../../models/entity/User";
import { validate } from "class-validator";

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
    }
  }
};
