import { ResolverMap } from "../../types/Resolvers.type";
import { User } from "../../models/entity/User";
import { validate } from "class-validator";

interface ErrorInterface {
  path: string;
  message: string;
}

const resolvers: ResolverMap = {
  Query: {
    user: async (_, { id }) => {
      try {
        const user = await User.findOne(id);
        return user;
      } catch (error) {
        console.error(error);
        return;
      }
    },
    users: async _ => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.error(error);
        return;
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

export default resolvers;
