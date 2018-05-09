import React from 'react';
import { Feed, Icon, Modal, Image } from 'semantic-ui-react';
import { distanceInWordsToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import LikePost from './LikePost';
import CommentPost from './CommentPost';

export const GET_POST_COMMENTS_COUNT_QUERY = gql`
  query($postId: String!) {
    getPostCommentsCount(postId: $postId)
  }
`;

const Post = ({ post, history }) => (
  <Feed.Event
    style={{
      padding: '30px',
      marginBottom: '10px',
      backgroundColor: '#fff',
      borderRadius: 5,
    }}
  >
    <Feed.Label
      image={`http://127.0.0.1:4000/${post.user.profilePicture.replace('public/', '')}`}
    />
    <Feed.Content>
      <Feed.Summary>
        <Link to={{ pathname: `/profile/${post.user.id}` }}> {post.user.nickName}</Link>
        <Feed.Date onClick={() => history.push(`/post/${post.id}`)} style={{ cursor: 'pointer' }}>
          {distanceInWordsToNow(post.createdAt)}
        </Feed.Date>
      </Feed.Summary>
      <Feed.Extra text> {post.caption} </Feed.Extra>
      {post.imageUrl && (
        <Feed.Extra>
          <Modal
            style={{
              marginTop: '0px !important',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            trigger={
              <a>
                <Image
                  size="medium"
                  alt="pic"
                  src={`http://127.0.0.1:4000/${post.imageUrl.replace('public/', '')}`}
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
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <LikePost postId={post.id} />
        <Feed.Like onClick={() => {}}>
          <Query query={GET_POST_COMMENTS_COUNT_QUERY} variables={{ postId: post.id }}>
            {({ loading, data, error }) => {
              if (loading) return 'Loading ...';
              if (error) return 'Error';

              return [
                <Icon name="comment" />,
                data.getPostCommentsCount ? data.getPostCommentsCount : 0,
                `   ${'comment'}`,
              ];
            }}
          </Query>
        </Feed.Like>
      </Feed.Meta>
      <Feed.Extra>
        <CommentPost postId={post.id} />
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
);

export default Post;
