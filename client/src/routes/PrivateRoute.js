import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';

export const MeQuery = gql`
  {
    me {
      id
      firstName
      lastName
      email
      birthDate
      gender
      nickName
      profilePicture
      hometown
      relationship
      aboutMe
    }
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Query query={MeQuery} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <Dimmer active inverted>
                <Loader inverted content="Loading" />
              </Dimmer>
            );
          }
          if (error) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
          }
          return <Component {...props} me={data.me} />;
        }}
      </Query>
    )}
  />
);

export default PrivateRoute;
