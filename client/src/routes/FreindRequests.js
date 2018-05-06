import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import SearchItem from '../components/Search/SearchItem';
import { GET_USER_QUERY } from './Search';

const GET_FRIEND_REQUESTS_QUERY = gql`
  {
    getMyFriendRequests {
      id
      senderEmail
    }
  }
`;

const FreindRequests = ({ me }) => (
  <Query query={GET_FRIEND_REQUESTS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading..';
      if (error) return 'ERROR';
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff',
            width: '100%',
            padding: '80px',
            borderRadius: '10px',
          }}
        >
          {data.getMyFriendRequests.map(fr => (
            <Query key={fr.id} query={GET_USER_QUERY} variables={{ email: fr.senderEmail }}>
              {(res) => {
                if (res.loading) return 'Loading';
                if (res.error) return 'Error';
                if (res.data.getUser.errors) {
                  return <h1> {data.getUser.errors.message} </h1>;
                }

                return <SearchItem data={res.data.getUser} me={me} email={fr.senderEmail} />;
              }}
            </Query>
          ))}
        </div>
      );
    }}
  </Query>
);

export default FreindRequests;
