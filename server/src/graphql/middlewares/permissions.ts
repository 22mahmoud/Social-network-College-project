import { isLoggedIn } from "../../services/auth.service";

export default {
  Mutation: {
    createPost: isLoggedIn,
    updatePost: isLoggedIn,
    deletePost: isLoggedIn
  }
};
