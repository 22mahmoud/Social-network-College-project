import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';

import PrivateRoute from './PrivateRoute';

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />
    <PrivateRoute path="/" component={Home} />
  </Switch>
);

export default App;
