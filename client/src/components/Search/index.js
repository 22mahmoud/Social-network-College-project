import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import SearchItem from './SearchItem';

export const GET_USER_QUERY = gql`
  query($email: String!) {
    getUser(email: $email) {
      id
      firstName
      lastName
      email
      youSent
      heSent
      notYet
      friendRequestId
      isFriend
      errors {
        path
        message
      }
    }
  }
`;

const Search = ({
  me,
  match: {
    params: { email },
  },
}) => (
  <Query query={GET_USER_QUERY} variables={{ email }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading';
      if (error) return 'Error';

      if (data.getUser.errors) {
        return <h1> {data.getUser.errors.message} </h1>;
      }

      return <SearchItem data={data.getUser} me={me} email={email} />;
    }}
  </Query>
);

export default Search;
