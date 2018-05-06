import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Feed } from 'semantic-ui-react';

import Post from '../components/Post/Post';

const GET_POST_QUERY = gql`
  query($postId: String!) {
    getPost(postId: $postId) {
      isOk
      post {
        id
        imageUrl
        caption
        createdAt
        user {
          id
          profilePicture
          nickName
          firstName
          lastName
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

const signlePost = ({
  match: {
    params: { id },
  },
}) => (
  <div
    style={{
      gridColumn: '2/5',
      justifySelf: 'center',
      width: '100%',
    }}
  >
    <Query query={GET_POST_QUERY} variables={{ postId: id }}>
      {({ loading, error, data }) => {
        if (loading) return 'loading';
        if (error) return 'error';
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        return (
          <Feed>
            <Post post={data.getPost.post} />
          </Feed>
        );
      }}
    </Query>
  </div>
);

export default signlePost;
