import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const MY_POST_QUERY = gql`
  query($userId: Int!) {
    getUserPosts(userId: $userId) {
      id
      imageUrl
      caption
      createdAt
    }
  }
`;
const Posts = ({ userId }) => (
  <Query query={MY_POST_QUERY} variables={{ userId }} pollInterval={200}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading ...';
      if (error) return 'Error';

      return data.getUserPosts.map(post => <h1 key={post.id}> {post.caption} </h1>);
    }}
  </Query>
);

export default Posts;
