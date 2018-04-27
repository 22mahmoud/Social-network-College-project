import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Feed } from 'semantic-ui-react';

import Post from './Post';

const MY_POST_QUERY = gql`
  query($userId: String!) {
    getUserPosts(userId: $userId) {
      id
      imageUrl
      caption
      createdAt
    }
  }
`;
const Posts = ({ me }) => (
  <Query query={MY_POST_QUERY} variables={{ userId: me.id }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading ...';
      if (error) return 'Error';

      return (
        <Feed>{data.getUserPosts.map(post => <Post key={post.id} user={me} post={post} />)}</Feed>
      );
    }}
  </Query>
);

export default Posts;
