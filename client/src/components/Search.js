import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_USER_QUERY = gql`
  query($email: String!) {
    getUser(email: $email) {
      isOk
      user {
        id
        firstName
        lastName
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

const Search = ({
  match: {
    params: { email },
  },
}) => (
  <Query query={GET_USER_QUERY} variables={{ email }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading';
      if (error) return 'Error';

      const {
        getUser: { errors, isOk, user },
      } = data;
      if (!isOk) {
        return <h1> {errors.message} </h1>;
      }

      return <h1> {user.firstName} </h1>;
    }}
  </Query>
);

export default Search;
