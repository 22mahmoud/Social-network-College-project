import React from 'react';
import { Feed, Icon, Modal, Image } from 'semantic-ui-react';
import { distanceInWordsToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import LikePost from './LikePost';
import CommentPost from './CommentPost';

const Post = ({ post, history }) =>
  console.log('POST', post) || (
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
                    size="small"
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
            <Icon name="comment" /> {Math.round(Math.random() * 200)}
            comment
          </Feed.Like>
        </Feed.Meta>
        <Feed.Extra>
          <CommentPost postId={post.id} />
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );

export default Post;
