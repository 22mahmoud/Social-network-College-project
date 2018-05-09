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
          nickName
          profilePicture
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
  history,
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
        if (data.getPost.errors && data.getPost.errors[0].path === 'post') {
          return (
            <Feed>
              <Feed.Event
                style={{
                  padding: '30px',
                  marginBottom: '10px',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                }}
              >
                <h1> {data.getPost.errors[0].message} </h1>
              </Feed.Event>
            </Feed>
          );
        }
        return (
          <Feed>
            <Post post={data.getPost.post} history={history} />
          </Feed>
        );
      }}
    </Query>
  </div>
);

export default signlePost;
