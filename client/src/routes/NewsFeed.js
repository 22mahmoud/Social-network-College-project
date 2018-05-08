import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Feed } from 'semantic-ui-react';

import Post from '../components/Post/Post';

const GET_MY_FRIENDS_POSTS = gql`
  query {
    getMyFriendsPosts {
      id
      imageUrl
      caption
      createdAt
      likesCount
      user {
        id
        nickName
        profilePicture
      }
    }
  }
`;

const NewsFeed = () => (
  <Query query={GET_MY_FRIENDS_POSTS} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) return 'Loading ...';
      if (error) return 'Error';
      return <Feed> {data.getMyFriendsPosts.map(post => <Post key={post.id} post={post} />)}</Feed>;
    }}
  </Query>
);

export default NewsFeed;
