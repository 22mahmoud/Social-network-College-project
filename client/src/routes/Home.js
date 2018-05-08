import React from 'react';
import { Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import PrivateRoute from './PrivateRoute';
import Search from './Search';
import signlePost from './singlePost';

import NewsFeed from './NewsFeed';
import NavBar from '../components/NavBar';
import FreindRequests from './FreindRequests';
import Settings from './Settings';

const Home = ({ history, me }) => (
  <div
    style={{
      minHeight: '100vh',
      background: '#ebebeb',
    }}
  >
    <NavBar me={me} history={history} />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        background: '#ebebeb',
      }}
    >
      <div
        style={{
          gridColumn: '4/8',
          justifySelf: 'center',
          width: '100%',
        }}
      >
        <Container style={{ marginTop: '7em' }}>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              component={props => <NewsFeed {...props} userId={me.id} />}
            />
            <PrivateRoute exact path="/post/:id" component={signlePost} />
            <PrivateRoute
              exact
              path="/friendrequests"
              component={props => <FreindRequests {...props} me={me} />}
            />
            <PrivateRoute
              exact
              path="/search/:email"
              component={props => <Search {...props} me={me} />}
            />
            <PrivateRoute
              exact
              path="/settings"
              component={props => <Settings {...props} me={me} />}
            />
          </Switch>
        </Container>
      </div>
    </div>
  </div>
);

export default Home;
