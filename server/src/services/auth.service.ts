import jwt from "jsonwebtoken";
import constants from "../config/constants";

import User from "../modules/User/User.entity";

export const isLoggedIn = async (resolve, _, __, ctx) => {
  try {
    const Authorization = ctx.request.get("Authorization");

    if (!Authorization) {
      throw new AuthError();
    }

    const token = Authorization.replace("Bearer ", "");
    const { id } = jwt.verify(token, constants.JWT_SECRET);

    const user = await User.findOne(id);
    if (!user) {
      throw new AuthError();
    }

    ctx.user = user;

    return resolve();
  } catch (error) {
    console.error(error);
    throw new AuthError();
  }
};

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}
