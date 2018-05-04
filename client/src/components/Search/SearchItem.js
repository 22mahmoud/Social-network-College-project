import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';

import { GET_USER_QUERY } from './index';

const SEND_FRRIEND_REQUEST_MUTATION = gql`
  mutation($userId: String!) {
    sendFriendRequest(userId: $userId)
  }
`;

const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
  mutation($friendRequestId: String!) {
    acceptFriendRequest(friendRequestId: $friendRequestId)
  }
`;

const ItemExampleItems = ({
  email: eQuery,
  data: {
    email, firstName, heSent, id, lastName, notYet, youSent, friendRequestId, isFriend,
  },
  me,
}) => (
  <Card.Group>
    <Card>
      <Card.Content>
        <Image floated="right" size="mini" src={`https://api.adorable.io/avatars/132/${id}.png`} />
        <Card.Header>
          {firstName} {lastName}
        </Card.Header>
        <Card.Meta> {email} </Card.Meta>
      </Card.Content>
      {id !== me.id ? (
        <ApolloConsumer>
          {client => (
            <Card.Content extra>
              <div className="ui two buttons">
                {heSent && (
                  <Button
                    color="blue"
                    onClick={() => {
                      client.mutate({
                        mutation: ACCEPT_FRIEND_REQUEST_MUTATION,
                        variables: {
                          friendRequestId,
                        },
                        update: (cache, { data: { acceptFriendRequest } }) => {
                          const { getUser } = cache.readQuery({
                            query: GET_USER_QUERY,
                            variables: {
                              email: eQuery,
                            },
                          });
                          cache.writeQuery({
                            query: GET_USER_QUERY,
                            data: {
                              getUser: {
                                ...getUser,
                                heSent: false,
                                isFriend: acceptFriendRequest,
                              },
                            },
                          });
                        },
                      });
                    }}
                    floated="right"
                  >
                    Accept friend request
                  </Button>
                )}
                {youSent && (
                  <Button floated="right" color="blue">
                    friend request sent
                  </Button>
                )}
                {notYet && (
                  <Button
                    onClick={() => {
                      client.mutate({
                        mutation: SEND_FRRIEND_REQUEST_MUTATION,
                        variables: {
                          userId: id,
                        },
                        update: (cache, { data: { sendFriendRequest } }) => {
                          const { getUser } = cache.readQuery({
                            query: GET_USER_QUERY,
                            variables: {
                              email: eQuery,
                            },
                          });

                          cache.writeQuery({
                            query: GET_USER_QUERY,
                            data: {
                              getUser: {
                                ...getUser,
                                notYet: false,
                                youSent: sendFriendRequest,
                              },
                            },
                          });
                        },
                      });
                    }}
                    floated="right"
                  >
                    Add
                  </Button>
                )}
                {isFriend && (
                  <Button floated="right" color="green">
                    <span role="img"> {'👍'} </span> Friends
                  </Button>
                )}
              </div>
            </Card.Content>
          )}
        </ApolloConsumer>
      ) : null}
    </Card>
  </Card.Group>
);

export default ItemExampleItems;
