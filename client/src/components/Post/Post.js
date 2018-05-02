import React from 'react';
import { Feed, Icon, Form, Modal, Image } from 'semantic-ui-react';
import { distanceInWordsToNow } from 'date-fns';
import { Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

const GET_POST_LIKES_COUNT_QUERY = gql`
  query($postId: String!) {
    getPostLikesCount(postId: $postId)
  }
`;

const IS_LIKE_QUERY = gql`
  query($postId: String!) {
    isLike(postId: $postId)
  }
`;

const LIKE_TOGGLE_MUTATION = gql`
  mutation($postId: String!) {
    likePostToggle(postId: $postId) {
      Liked
    }
  }
`;

const Post = ({ post }) => {
  const textAreaRef = React.createRef();
  return (
    <Feed.Event
      style={{
        padding: '30px',
        marginBottom: '10px',
        backgroundColor: '#fff',
        borderRadius: 5,
      }}
    >
      <Feed.Label image={`https://api.adorable.io/avatars/132/${post.user.id}.png`} />
      <Feed.Content>
        <Feed.Summary>
          <a> {`${post.user.firstName}  ${post.user.lastName}`} </a>
          <Feed.Date> {distanceInWordsToNow(post.createdAt)} </Feed.Date>
        </Feed.Summary>
        <Feed.Extra text> {post.caption} </Feed.Extra>
        {post.imageUrl && (
          <Feed.Extra images>
            <Modal
              style={{
                marginTop: '0px !important',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              trigger={
                <a>
                  <Image
                    alt="pic"
                    src={`http://localhost:4000/${post.imageUrl.replace('public/', '')}`}
                  />
                </a>
              }
            >
              <div
                style={{
                  padding: '10px 0 10px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Modal.Content image>
                  <Image
                    wrapped
                    size="large"
                    src={`http://localhost:4000/${post.imageUrl.replace('public/', '')}`}
                  />
                </Modal.Content>
              </div>
            </Modal>
          </Feed.Extra>
        )}
        <Feed.Meta
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Query
            query={GET_POST_LIKES_COUNT_QUERY}
            fetchPolicy="network-only"
            variables={{ postId: post.id }}
          >
            {({ loading, error, data }) => {
              if (loading) return 'Loading ...';
              if (error) return 'Error';
              return (
                <div>
                  <Query
                    query={IS_LIKE_QUERY}
                    variables={{ postId: post.id }}
                    fetchPolicy="network-only"
                  >
                    {({ loading: l, error: e, data: d }) => {
                      if (l) return 'Loading ...';
                      if (e) return 'Error';
                      return (
                        <ApolloConsumer>
                          {client => (
                            <Feed.Like
                              onClick={async () => {
                                await client.mutate({
                                  mutation: LIKE_TOGGLE_MUTATION,
                                  variables: { postId: post.id },
                                });
                              }}
                            >
                              <Icon name="like" color={d.isLike && 'red'} />
                              {`${data.getPostLikesCount} Likes`}
                            </Feed.Like>
                          )}
                        </ApolloConsumer>
                      );
                    }}
                  </Query>
                </div>
              );
            }}
          </Query>

          <Feed.Like onClick={() => textAreaRef.current.childNodes[0][0].focus()}>
            <Icon name="comment" />
            {Math.round(Math.random() * 200)} comment
          </Feed.Like>
        </Feed.Meta>
        <Feed.Extra>
          <div ref={textAreaRef}>
            <Form>
              <Form.TextArea
                onInput={e =>
                  e.target.addEventListener('keypress', (event) => {
                    if (event.keyCode === 13 && !event.shiftKey) {
                      event.preventDefault();
                      console.log(event.currentTarget.value);
                    }
                  })
                }
                rows={1}
                autoHeight
                placeholder="add comment..."
                type="text"
                name="firstName"
              />
            </Form>
          </div>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
};
export default Post;
