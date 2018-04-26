import React from 'react';
import { Feed, Icon } from 'semantic-ui-react';
import { distanceInWordsToNow } from 'date-fns';

const Post = ({ user, post }) => (
  <Feed.Event>
    <Feed.Label image="https://react.semantic-ui.com/assets/images/avatar/small/jenny.jpg" />
    <Feed.Content>
      <Feed.Summary>
        <a>{`${user.firstNauser}  ${user.lastName}`}</a>
        <Feed.Date>{distanceInWordsToNow(post.createdAt)}</Feed.Date>
      </Feed.Summary>
      <Feed.Extra text>{post.caption}</Feed.Extra>

      {post.imageUrl && (
        <Feed.Extra images>
          <a>
            <img alt="pic" src="https://react.semantic-ui.com/assets/images/wireframe/image.png" />
          </a>
        </Feed.Extra>
      )}
      <Feed.Meta>
        <Feed.Like>
          <Icon name="like" />
          5 Likes
        </Feed.Like>
      </Feed.Meta>
    </Feed.Content>
  </Feed.Event>
);

export default Post;
