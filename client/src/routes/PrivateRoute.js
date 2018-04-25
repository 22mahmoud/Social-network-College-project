import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Spin, Layout } from 'antd';

const { Content } = Layout;

const MeQuery = gql`
  {
    me {
      id
      firstName
      lastName
      email
    }
  }
`;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Query query={MeQuery}>
        {({ loading, error, data }) => {
          if (loading) {
            return <Spin />;
          }
          if (error) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />;
          }
          return <Component {...props} me={data} />;
        }}
      </Query>
    )}
  />
);

export default PrivateRoute;
