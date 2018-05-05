import React from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { Feed, Icon } from 'semantic-ui-react';


const GET_POST_LIKES_COUNT_QUERY = gql`
  query($postId: String!) {
    getPostLikesCount(postId: $postId)
  }
`;

const IS_LIKE_QUERY = gql`
  query($postId: String!) {
    isLike(postId: $postId) {
      Liked
    }
  }
`;

const LIKE_TOGGLE_MUTATION = gql`
  mutation($postId: String!) {
    likePostToggle(postId: $postId) {
      Liked
    }
  }
`;

const LikePost = ({ postId }) => (
  <Query
    query={GET_POST_LIKES_COUNT_QUERY}
    variables={{
      postId,
    }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading ...';
      if (error) return 'Error';
      return (
        <div>
          <Query
            query={IS_LIKE_QUERY}
            variables={{
              postId,
            }}
          >
            {({ loading: l, error: e, data: d }) => {
              if (l) return 'Loading ...';
              if (e) return 'Error';
              return (
                <ApolloConsumer>
                  {client => (
                    <Feed.Like
                      onClick={() => {
                        client.mutate({
                          mutation: LIKE_TOGGLE_MUTATION,
                          variables: {
                            postId,
                          },

                          update: (cache, { data: { likePostToggle } }) => {
                            const { isLike } = cache.readQuery({
                              query: IS_LIKE_QUERY,
                              variables: {
                                postId,
                              },
                            });

                            const { getPostLikesCount } = cache.readQuery({
                              query: GET_POST_LIKES_COUNT_QUERY,
                              variables: {
                                postId,
                              },
                            });

                            const newLikesCount = likePostToggle.Liked
                              ? getPostLikesCount + 1
                              : getPostLikesCount - 1;

                            cache.writeQuery({
                              query: GET_POST_LIKES_COUNT_QUERY,
                              variables: {
                                postId,
                              },
                              data: {
                                getPostLikesCount: newLikesCount,
                              },
                            });

                            cache.writeQuery({
                              query: IS_LIKE_QUERY,
                              variables: {
                                postId,
                              },
                              data: {
                                isLike: {
                                  ...isLike,
                                  Liked: likePostToggle.Liked,
                                },
                              },
                            });
                          },
                        });
                      }}
                    >
                      <Icon name="like" color={d.isLike.Liked ? 'red' : 'grey'} />
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
);

export default LikePost;
