import * as path from "path";
import { mergeResolvers, fileLoader, mergeTypes } from "merge-graphql-schemas";
import { isLoggedIn } from "../services/auth.service";

const resolversArray = fileLoader(path.join(__dirname, "./**/*.resolvers.*"));
const typesArray = fileLoader(path.join(__dirname, "./**/*.schema.*"));

export const typeDefs = mergeTypes(typesArray);
export const resolvers = mergeResolvers(resolversArray);

console.log("====================================");
console.log(typesArray);
console.log("====================================");

export const permissions = {
  Mutation: {
    createPost: isLoggedIn,
    updatePost: isLoggedIn,
    deletePost: isLoggedIn,
    sendFriendRequest: isLoggedIn,
    acceptFriendRequest: isLoggedIn,
    likePostToggle: isLoggedIn,
    commentPost: isLoggedIn,
    updateUserBasicInfo: isLoggedIn,
    updateUserPassword: isLoggedIn,
    updateUserProfilePicture: isLoggedIn
  },
  Query: {
    getPostComments: isLoggedIn,
    getPostCommentsCount: isLoggedIn,
    isLike: isLoggedIn,
    getPost: isLoggedIn,
    getPostLikesCount: isLoggedIn,
    me: isLoggedIn,
    getUserPosts: isLoggedIn,
    getMyFriends: isLoggedIn,
    getUser: isLoggedIn,
    getMyFriendRequests: isLoggedIn,
    getMyFriendsPosts: isLoggedIn,
    getProfile: isLoggedIn
  }
};
