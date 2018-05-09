import React from 'react';
import { Form, Comment, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Query, ApolloConsumer } from 'react-apollo';
import { distanceInWordsToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import { GET_POST_COMMENTS_COUNT_QUERY } from './Post';

const GET_POST_COMMENT_QUERY = gql`
  query($postId: String!) {
    getPostComments(postId: $postId) {
      id
      user {
        id
        nickName
        profilePicture
      }
      content
      createdAt
    }
  }
`;

const COMMENT_POST_MUTATION = gql`
  mutation($postId: String!, $content: String!) {
    commentPost(postId: $postId, content: $content) {
      id
      __typename
      user {
        id
        nickName
        profilePicture
      }
      content
      createdAt
    }
  }
`;

class CommentPost extends React.Component {
  state = {
    content: '',
  };

  render() {
    const { postId } = this.props;
    return (
      <React.Fragment>
        <Query query={GET_POST_COMMENT_QUERY} variables={{ postId }}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading..';
            if (error) return 'error.';

            return (
              <Comment.Group>
                <div
                  style={{ background: 'rgba(1,1,1,.009)', padding: '10px', marginBottom: '5px ' }}
                >
                  {data.getPostComments.map((comment) => {
                    const {
                      id,
                      user: { profilePicture, nickName, id: userId },
                      createdAt,
                      content,
                    } = comment;

                    return (
                      <Comment key={id}>
                        <Comment.Avatar
                          src={`http://127.0.0.1:4000/${profilePicture.replace('public/', '')}`}
                        />
                        <Comment.Content>
                          <Comment.Author as="a">
                            <Link to={{ pathname: `/profile/${userId}` }}> {nickName}</Link>
                          </Comment.Author>
                          <Comment.Metadata>
                            <div>{distanceInWordsToNow(createdAt)}</div>
                          </Comment.Metadata>
                          <Comment.Text>{content}</Comment.Text>
                        </Comment.Content>
                      </Comment>
                    );
                  })}
                </div>
              </Comment.Group>
            );
          }}
        </Query>
        <ApolloConsumer>
          {client => (
            <Form
              onSubmit={() => {
                this.setState({ content: '' });
                client.mutate({
                  mutation: COMMENT_POST_MUTATION,
                  variables: { postId, content: this.state.content },

                  update: (cache, { data: { commentPost } }) => {
                    const { getPostComments } = cache.readQuery({
                      query: GET_POST_COMMENT_QUERY,
                      variables: {
                        postId,
                      },
                    });

                    cache.writeQuery({
                      query: GET_POST_COMMENT_QUERY,
                      variables: {
                        postId,
                      },
                      data: {
                        getPostComments: [...getPostComments, commentPost],
                      },
                    });

                    const { getPostCommentsCount } = cache.readQuery({
                      query: GET_POST_COMMENTS_COUNT_QUERY,
                      variables: {
                        postId,
                      },
                    });

                    cache.writeQuery({
                      query: GET_POST_COMMENTS_COUNT_QUERY,
                      variables: {
                        postId,
                      },
                      data: {
                        getPostCommentsCount: getPostCommentsCount + 1,
                      },
                    });
                  },
                });
              }}
            >
              <Form.TextArea
                value={this.state.content}
                onChange={e => this.setState({ content: e.target.value })}
                rows={1}
                autoHeight
                placeholder="add comment..."
                type="text"
                name="firstName"
              />
              <Button type="submit"> Comment </Button>
            </Form>
          )}
        </ApolloConsumer>
      </React.Fragment>
    );
  }
}

export default CommentPost;
