import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from '../routes/PrivateRoute';
import NewsFeed from '../components/Post/NewsFeed';
import Search from '../components/Search';
import NavBar from '../components/NavBar';
import Post from '../components/Post/Post';
import signlePost from './singlePost';

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
        gridTemplateColumns: 'repeat(5, 1fr)',
        background: '#ebebeb',
      }}
    >
      <Switch>
        <PrivateRoute exact path="/" component={props => <NewsFeed {...props} userId={me.id} />} />
        <PrivateRoute exact path="/post/:id" component={signlePost} />
        <PrivateRoute
          exact
          path="/search/:email"
          component={props => <Search {...props} me={me} />}
        />
      </Switch>
    </div>
  </div>
);

export default Home;
