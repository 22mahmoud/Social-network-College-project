import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Feed } from 'semantic-ui-react';

import Post from './Post';

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
        firstName
        lastName
      }
    }
  }
`;

const NewsFeed = () => (
  <div
    style={{
      gridColumn: '2/5',
      justifySelf: 'center',
      width: '100%',
    }}
  >
    <Query query={GET_MY_FRIENDS_POSTS}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading ...';
        if (error) return 'Error';

        return (
          <Feed> {data.getMyFriendsPosts.map(post => <Post key={post.id} post={post} />)}</Feed>
        );
      }}
    </Query>
  </div>
);

export default NewsFeed;
