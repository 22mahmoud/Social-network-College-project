import { isLoggedIn } from "../../services/auth.service";

export default {
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
    getMyFriendsPosts: isLoggedIn
  }
};
