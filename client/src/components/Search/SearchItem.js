import React from 'react';
import { Item, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

import { GET_USER_QUERY } from './index';

const SEND_FRRIEND_REQUEST_MUTATION = gql`
  mutation($userId: String!) {
    sendFriendRequest(userId: $userId)
  }
`;

const ItemExampleItems = ({
  data: {
    email, firstName, heSent, id, lastName, notYet, youSent,
  },
  me,
}) => (
  <Item.Group relaxed>
    <Item>
      <Item.Image
        size="tiny"
        src="https://react.semantic-ui.com/assets/images/wireframe/image.png"
      />
      <Item.Content>
        <Item.Header as="a">
          {firstName} {lastName}
        </Item.Header>
        <Item.Description>{email}</Item.Description>
        {id !== me.id ? (
          <ApolloConsumer>
            {client => (
              <Item.Extra>
                {heSent && (
                  <Button onClick={() => {}} floated="right">
                    Accept friend request
                  </Button>
                )}
                {youSent && (
                  <Button onClick={() => {}} floated="right">
                    friend request sent
                  </Button>
                )}
                {notYet && (
                  <Button
                    onClick={() => {
                      client.mutate({
                        mutation: SEND_FRRIEND_REQUEST_MUTATION,
                        variables: { userId: id },
                      });
                    }}
                    floated="right"
                  >
                    Add
                  </Button>
                )}
              </Item.Extra>
            )}
          </ApolloConsumer>
        ) : null}
      </Item.Content>
    </Item>
  </Item.Group>
);

export default ItemExampleItems;
