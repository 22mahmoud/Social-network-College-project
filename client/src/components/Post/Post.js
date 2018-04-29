import React from 'react';
import { Feed, Icon, Form } from 'semantic-ui-react';
import { distanceInWordsToNow } from 'date-fns';

const Post = ({ post }) => (
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
      {post.imageUrl || (
        <Feed.Extra images>
          <a>
            <img alt="pic" src={`https://api.adorable.io/avatars/132/${post.id}1.png`} />
          </a>
          <a>
            <img alt="pic" src={`https://api.adorable.io/avatars/132/${post.id}2.png`} />
          </a>
          <a>
            <img alt="pic" src={`https://api.adorable.io/avatars/132/${post.id}3.png`} />
          </a>
        </Feed.Extra>
      )}
      <Feed.Meta style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Feed.Like>
          <Icon name="like" />
          {Math.round(Math.random() * 200)} Likes
        </Feed.Like>
        <Feed.Like>
          <Icon name="comment" />
          {Math.round(Math.random() * 200)} comment
        </Feed.Like>
      </Feed.Meta>
      <Feed.Extra>
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
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>
);

export default Post;
