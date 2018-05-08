import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import UserFriendButtonState from './UserFriendButtonState';

const ItemExampleItems = ({
  email: eQuery,
  data: {
    nickName, profilePicture, email, heSent, id, notYet, youSent, friendRequestId, isFriend,
  },
  me,
}) => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src={`http://127.0.0.1:4000/${profilePicture.replace('public/', '')}`}
        />
        <Card.Header>{nickName}</Card.Header>
        <Card.Meta> {email} </Card.Meta>
      </Card.Content>
      {id !== me.id ? (
        <UserFriendButtonState
          data={{
            id,
            eQuery,
            heSent,
            notYet,
            youSent,
            friendRequestId,
            isFriend,
          }}
        />
      ) : null}
    </Card>
  </Card.Group>
);

export default ItemExampleItems;
